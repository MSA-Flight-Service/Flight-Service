package com.example.airlist.service;

import com.example.airlist.dto.FlightInfoDto;
import com.example.airlist.entity.Flight_info;
import com.example.airlist.repository.FlightInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class FlightIdService {


    private final FlightInfoRepository flightInfoRepository;
    public FlightIdService(FlightInfoRepository flightInfoRepository) {
        this.flightInfoRepository = flightInfoRepository;
    }

    public FlightInfoDto getFlightById(Long id) {
        Flight_info flight = flightInfoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 항공편이 없습니다: " + id));

        return new FlightInfoDto(
                flight.getId(),
                flight.getDeparture().getNameKorean(),
                flight.getArrival().getNameKorean(),
                flight.getDepartureTime(),
                flight.getArrivalTime(),
                flight.getAircraft().getCModel(),
                flight.getSeatCount()
        );
    }
}
