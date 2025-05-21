package com.example.demo.reservationservice.service;

import com.example.demo.reservationservice.dto.*;
import com.example.demo.reservationservice.entitiy.Reservation;
import com.example.demo.reservationservice.repository.ReservationRepository;
import com.example.demo.reservationservice.util.TimedStorage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ObjectMapper objectMapper;
    private final ReservationRepository reservationRepository;
    private final TimedStorage timedStorage;
    private final RedisTemplate<String, Object> redisTemplate;

    public String saveInitialData(Long uId, String uName, String reservationId) {

        // 1. Redis에서 Kafka Consumer가 저장한 FlightDto 꺼냄
        Object obj = redisTemplate.opsForValue().get(reservationId);
        FlightDto flightDto = objectMapper.convertValue(obj, FlightDto.class);

        if (flightDto == null) {
            System.out.println("❌ Redis에서 flightDto를 찾을 수 없습니다. 예약 생성 중단");
            return null;  // 프론트에서 이 경우 실패 처리
        }

        // 2. TimedStorage에 저장할 key 생성
        String key = UUID.randomUUID().toString();
        ReservationRequestDTO dto = new ReservationRequestDTO();

        // 3. 예약 정보 조립
        ReservationDTO reservationDTO = ReservationDTO.builder()
                .fId(flightDto.getId())
                .fDeparture(flightDto.getDepartureName())
                .fArrival(flightDto.getArrivalName())
                .fDepartureTime(flightDto.getDepartureTime())
                .fArrivalTime(flightDto.getArrivalTime())
                .fSeatCount(flightDto.getSeatCount())
                .fAircraftType(flightDto.getAircraftType())
                .uId(uId)
                .uName(uName)
                .build();

        dto.setReservation(reservationDTO);
        timedStorage.put(key, dto);

        return key;
    }


    public boolean isReservationInRedis(String reservationId) {
        return redisTemplate.opsForValue().get(reservationId) != null;
    }


    public ReservationRequestDTO getReservationData(String key) {
        return objectMapper.convertValue(timedStorage.get(key), ReservationRequestDTO.class);
    }

    public ReservationRequestDTO updateSeats(String key, List<SeatDTO> seats) {
        ReservationRequestDTO request = getReservationData(key);
        if (request != null) {
            request.setSeats(new ArrayList<>(seats));
            timedStorage.put(key, request);
        }
        return request;
    }

    public Map<String, List<String>> tryLockSeats(String key, List<SeatDTO> seats) {
        ReservationRequestDTO request = getReservationData(key);
        if (request == null) return null;

        Long fId = request.getReservation().getFId();
        List<String> locked = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        for (SeatDTO seat : seats) {
            if (timedStorage.tryLockSeat(fId, seat.getSSpot())) {
                locked.add(seat.getSSpot());
            } else {
                failed.add(seat.getSSpot());
            }
        }

        List<SeatDTO> successSeats = seats.stream()
                .filter(seat -> locked.contains(seat.getSSpot()))
                .toList();
        request.setSeats(successSeats);
        timedStorage.put(key, request);

        return Map.of("locked", locked, "failed", failed);
    }

    /**
     * 특정 항공편(flightId)에 대해 현재 락 중인 좌석 목록을 반환합니다.
     */
    public List<String> getLockedSeatsByFlightId(String key) {
        ReservationRequestDTO request = getReservationData(key);
        Long fId = request.getReservation().getFId();
        return timedStorage.getLockedSpotsByFlight(fId);
    }

    public List<String> getReservedSpots(Long fId) {
        return reservationRepository.findReservationSSpotByFId(fId);
    }

    public boolean confirmReservation(String key) {
        ReservationRequestDTO request = getReservationData(key);
        if (request == null) return false;

        ReservationDTO dto = request.getReservation();
        List<SeatDTO> seats = request.getSeats();
        List<Reservation> reservations = new ArrayList<>();

        String groupId = UUID.randomUUID().toString();



        for (SeatDTO seat : seats) {
            reservations.add(Reservation.builder()
                    .uId(dto.getUId())
                    .fId(dto.getFId())
                    .rDate(LocalDateTime.now())
                    .fDeparture(dto.getFDeparture())
                    .fArrival(dto.getFArrival())
                    .fDepartureTime(dto.getFDepartureTime())
                    .fArrivalTime(dto.getFArrivalTime())
                    .ticketPrice(seat.getSPrice())
                    .fAircraftType(dto.getFAircraftType())
                    .groupId(groupId)
                    .cId(dto.getCId())
                    .uName(dto.getUName())
                    .sName(seat.getSName())
                    .sSpot(seat.getSSpot())
                    .sClass(seat.getSClass())
                    .build());
        }

        reservationRepository.saveAll(reservations);
        timedStorage.remove(key);

        return true;
    }

    public boolean cancelReservation(String key) {

        ReservationRequestDTO request = getReservationData(key);
        if (request == null) {return false;}

        timedStorage.remove(key);
        Long fId = request.getReservation().getFId();
        // 분리된 메서드 호출
        releaseSeatLocks(fId, request.getSeats());

        return true;
    }

    // 좌석 잠금 해제를 처리하는 분리된 메서드
    private void releaseSeatLocks(Long fId, List<SeatDTO> seats) {
        for (SeatDTO seat : seats) {
            String seatNo = seat.getSSpot();
            timedStorage.releaseSeatLock(fId, seatNo);
        }
    }

    public List<Reservation> findReservationsByUserId(Long uId) {
        return reservationRepository.findByUId(uId);
    }

    public String deleteReservationById(Long rId) {
        Reservation reservation = reservationRepository.findById(rId)
                .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));

        if (reservation.getPayment() != null) {
            throw new IllegalStateException("❌ 결제된 예약은 삭제할 수 없습니다.");
        }

        reservationRepository.deleteById(rId);
        return "✅ 예약이 삭제되었습니다.";
    }
}
