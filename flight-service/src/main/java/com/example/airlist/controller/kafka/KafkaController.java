package com.example.airlist.controller.kafka;

import com.example.airlist.dto.FlightReservationDto;
import com.example.airlist.service.kafka.FlightKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kafka")
@RequiredArgsConstructor
public class KafkaController {

    private final FlightKafkaProducer flightKafkaProducer;

    @PostMapping("/publish")
    public ResponseEntity<String> publishFlight(@RequestBody FlightReservationDto flightDto){
        flightKafkaProducer.sendFlightData(flightDto);
        return ResponseEntity.ok("전송완료");
    }
}
