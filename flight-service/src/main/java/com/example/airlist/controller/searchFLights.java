package com.example.airlist.controller;

import com.example.airlist.dto.FlightDto;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class searchFLights {

    private final FlightEsSearch flightEsSearch;

    public searchFLights(FlightEsSearch flightEsSearch) {
        this.flightEsSearch = flightEsSearch;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFlights(
            @RequestParam String departure,
            @RequestParam String arrival,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        System.out.println("편도 검색 요청: " + departure + " → " + arrival + " / " + date);

        String safeDate = (date == null) ? "" : date;
        LocalDateTime depTime = safeDate.isBlank()
                ? LocalDateTime.now()
                : parseSafe(safeDate, false);

        Page<FlightDocument> result = flightEsSearch.searchElastic(departure, arrival, depTime, page, size);
        Page<FlightDto> dtoResult = result.map(this::toDto);
        return ResponseEntity.ok(dtoResult);
    }


    @GetMapping("/search/split")
    public ResponseEntity<?> searchRoundTripSplit(
            @RequestParam String departure,
            @RequestParam String arrival,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "returnDate", required = false) String returnDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        System.out.println("검색 요청: " + departure + " → " + arrival + " / " + date);

        LocalDateTime depTime = parseSafe(date,false);
        LocalDateTime retTime = parseSafe(returnDate,true);

        Page<FlightDocument> goList = flightEsSearch.searchElastic(departure, arrival, depTime, page, size);
        Page<FlightDocument> backList = flightEsSearch.searchElastic(arrival, departure, retTime, page, size);

        return ResponseEntity.ok(Map.of(
                "goList", goList.map(this::toDto).getContent(),
                "backList", backList.map(this::toDto).getContent()
        ));
    }

    private LocalDateTime parseSafe(String dateStr, boolean isReturn) {
        if (dateStr == null || dateStr.isBlank()) {
            return isReturn ? LocalDateTime.now().plusDays(1) : LocalDateTime.now();
        }

        dateStr = dateStr.trim();

        try {
            return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE).atStartOfDay();
        }
    }



    private FlightDto toDto(FlightDocument doc) {
        return new FlightDto(
                doc.getId(),
                doc.getDepartureName(),
                doc.getArrivalName(),
                doc.getDepartureTime(),
                doc.getArrivalTime(),
                doc.getAircraftModel(),
                doc.getSeatCount(),
                doc.getPrice()
        );
    }
}
