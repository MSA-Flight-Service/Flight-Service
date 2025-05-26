package com.example.demo.reservationservice.service;

import com.example.demo.reservationservice.dto.PaymentStatusResponse;
import com.example.demo.reservationservice.entitiy.Payment;
import com.example.demo.reservationservice.entitiy.Reservation;
import com.example.demo.reservationservice.repository.PaymentRepository;
import com.example.demo.reservationservice.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    public Optional<Payment> createVirtualPayment(Long rId, Long uId) {
        Optional<Reservation> opt = reservationRepository.findByRId(rId);
        if (opt.isEmpty()) return Optional.empty();

        Reservation reservation = opt.get();
        if (!reservation.getUId().equals(uId)) return Optional.empty();
        if (reservation.getPayment() != null) return Optional.of(reservation.getPayment());

        Payment payment = Payment.builder()
                .uId(uId)
                .price(reservation.getTicketPrice())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        reservation.setPayment(saved);
        reservationRepository.save(reservation);

        return Optional.of(saved);
    }

    public Optional<Payment> createGroupPayment(Long uId, String groupId) {
        List<Reservation> reservations = reservationRepository.findByUIdAndGroupIdAndPaymentIsNull(uId, groupId);
        if (reservations.isEmpty()) return Optional.empty();

        int totalPrice = reservations.stream().mapToInt(Reservation::getTicketPrice).sum();

        Payment payment = Payment.builder()
                .uId(uId)
                .price(totalPrice)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        reservations.forEach(r -> r.setPayment(saved));
        reservationRepository.saveAll(reservations);

        return Optional.of(saved);
    }

    public PaymentStatusResponse getPaymentStatus(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .map(p -> new PaymentStatusResponse(p.getStatus()))
                .orElseGet(() -> new PaymentStatusResponse("NONE"));
    }

    public List<Reservation> getReservationsByPaymentId(Long paymentId) {
        return reservationRepository.findByPaymentId(paymentId);
    }

    public String deleteSingleReservation(Long rId) {
        Reservation reservation = reservationRepository.findByRId(rId)
                .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));

        if (reservation.getRDate().isBefore(LocalDateTime.now().minusDays(3))) {
            throw new IllegalStateException("삭제는 생성 후 3일 이내만 가능합니다.");
        }

        Payment payment = reservation.getPayment();
        reservationRepository.deleteByRId(rId);

        if (payment != null) {
            List<Reservation> linked = reservationRepository.findByPaymentId(payment.getPaymentId());
            if (linked.isEmpty()) {
                paymentRepository.deleteById(payment.getPaymentId());
            }
        }

        return "deleted";
    }

    public void deleteReservationsByGroup(Long uId, String groupId) {
        List<Reservation> reservations = reservationRepository.findByUIdAndGroupId(uId, groupId);
        if (reservations.isEmpty()) throw new RuntimeException("해당 그룹 예매 없음");

        boolean anyExpired = reservations.stream()
                .anyMatch(r -> r.getRDate().isBefore(LocalDateTime.now().minusDays(3)));
        if (anyExpired) {
            throw new IllegalStateException("모든 예매는 생성 후 3일 이내여야 삭제 가능합니다.");
        }

        Set<Long> paymentIds = reservations.stream()
                .map(r -> Optional.ofNullable(r.getPayment()).map(Payment::getPaymentId).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        reservations.forEach(r -> reservationRepository.deleteByRId(r.getRId()));

        for (Long pid : paymentIds) {
            List<Reservation> remains = reservationRepository.findByPaymentId(pid);
            if (remains.isEmpty()) {
                paymentRepository.deleteById(pid);
            }
        }
    }

    public Map<Long, Boolean> checkReservationsPaid(List<Long> rIds) {
        List<Reservation> reservations = reservationRepository.findAllById(rIds);
        return reservations.stream()
                .collect(Collectors.toMap(
                        Reservation::getRId,
                        r -> r.getPayment() != null
                ));
    }
}
