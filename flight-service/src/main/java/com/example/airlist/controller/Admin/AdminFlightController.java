package com.example.airlist.controller.Admin;

import com.example.airlist.dto.FlightInfoDto;
import com.example.airlist.entity.AirCraft;
import com.example.airlist.entity.Airport;
import com.example.airlist.entity.Flight_info;
import com.example.airlist.repository.AirCraftRepository;
import com.example.airlist.repository.AirPortRepository;
import com.example.airlist.repository.FlightInfoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/flights")
public class AdminFlightController {

    private final FlightInfoRepository flightInfoRepository;
    private final AirCraftRepository airCraftRepository;
    private final AirPortRepository airPortRepository;
    public AdminFlightController(FlightInfoRepository flightInfoRepository,
                                 AirPortRepository airPortRepository,
                                 AirCraftRepository airCraftRepository) {
        this.flightInfoRepository = flightInfoRepository;
        this.airCraftRepository = airCraftRepository;
        this.airPortRepository = airPortRepository;
    }

    @GetMapping
    public ResponseEntity<List<FlightInfoDto>> getAllFlights() {
        List<Flight_info> entities = flightInfoRepository.findAll();

        List<FlightInfoDto> dtoList = entities.stream().map(e -> new FlightInfoDto(
                e.getId(),
                e.getDeparture().getNameKorean(),
                e.getArrival().getNameKorean(),
                e.getDepartureTime(),
                e.getArrivalTime(),
                e.getAircraft().getCModel(),
                e.getSeatCount()
        )).toList();

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/airports")
    public ResponseEntity<List<Airport>> getAirports() {
        List<Airport> entities = airPortRepository.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/aircraft")
    public ResponseEntity<List<AirCraft>> getAirCraft() {
        List<AirCraft> entities = airCraftRepository.findAll();
        return ResponseEntity.ok(entities);
    }

    @PostMapping
    public ResponseEntity<FlightInfoDto> createFlight(@RequestBody FlightInfoDto dto) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightInfoDto> updateFlight(@RequestBody FlightInfoDto dto) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<FlightInfoDto> deleteFlight(@RequestBody FlightInfoDto dto) {
        return null;
    }
}
