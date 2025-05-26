package com.example.airlist.controller;

import com.example.airlist.dto.FlightInfoDto;
import com.example.airlist.entity.FlightDocument;
import com.example.airlist.service.elastic.FlightEsSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/flights")
public class FlightEsController {


    private final FlightEsSearch flightSearchService;

    public FlightEsController(FlightEsSearch flightSearchService) {
        this.flightSearchService = flightSearchService;
    }

    @GetMapping
    public ResponseEntity<?> getAllFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (size < 1) size = 10;

        Pageable pageable = PageRequest.of(page, size);
        Page<FlightDocument> result = flightSearchService.findAllPaged(pageable);

        List<FlightInfoDto> dtoList = result.map(doc -> new FlightInfoDto(
                doc.getId(),
                doc.getDepartureName(),
                doc.getArrivalName(),
                doc.getDepartureTime(),
                doc.getArrivalTime(),
                doc.getAircraftModel(),
                doc.getSeatCount()
        )).getContent(); //res.data.content 부분만되게


        return ResponseEntity.ok(dtoList);  // 👈 배열만 응답
    }


}





