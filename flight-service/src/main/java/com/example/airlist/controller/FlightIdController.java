package com.example.airlist.controller;


import com.example.airlist.dto.FlightInfoDto;
import com.example.airlist.service.FlightIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flights")
public class FlightIdController {

    private final FlightIdService flightIdService;
    public FlightIdController(FlightIdService flightIdService) {
        this.flightIdService = flightIdService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<FlightInfoDto> getFlightById(@PathVariable Long id){
        FlightInfoDto flight = flightIdService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }
}
