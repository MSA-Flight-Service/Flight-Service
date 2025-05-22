package com.example.airlist.service.elastic;

import com.example.airlist.entity.FlightDocument;
import com.example.airlist.entity.Flight_info;
import com.example.airlist.repository.FlightInfoRepository;
import com.example.airlist.repository.FlightSearchRepositroy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class FlightEsIndexer {

    private final FlightSearchRepositroy flightSearchRepositroy;
    private final FlightInfoRepository flightInfoRepository;

    public FlightEsIndexer(FlightSearchRepositroy flightSearchRepositroy, FlightInfoRepository flightInfoRepository) {
        this.flightSearchRepositroy = flightSearchRepositroy;
        this.flightInfoRepository = flightInfoRepository;
    }

    public void indexAll() {
        List<Flight_info> flights = flightInfoRepository.findAll(); //기존 테이블에서 가져옴

        List<FlightDocument> docs = flights.stream().map(flight -> {
            return FlightDocument.builder()
                    .id(flight.getId())
                    .departureName(flight.getDeparture().getNameKorean())
                    .arrivalName(flight.getArrival().getNameKorean())
                    .departureTime(flight.getDepartureTime())
                    .arrivalTime(flight.getArrivalTime())
                    .aircraftModel(flight.getAircraft().getCModel()) // 또는 적절한 필드
                    .seatCount(flight.getSeatCount())
                    .price(100000 + new Random().nextInt(300000)) // 테스트용 랜덤 가격
                    .build();
        }).toList();

        flightSearchRepositroy.saveAll(docs);
    }
}
