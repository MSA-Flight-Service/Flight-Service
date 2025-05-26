package com.example.airlist.repository;

import com.example.airlist.entity.FlightDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightSearchRepositroy extends ElasticsearchRepository<FlightDocument, String> {

    Page<FlightDocument> findByDepartureNameContainingAndArrivalNameContainingAndDepartureTimeAfter(String departure, String arrival
            , LocalDateTime departureTime, Pageable pageable);

    Page<FlightDocument> findByDepartureNameContainingAndArrivalNameContaining(String dep, String arr, Pageable pageable);

    Page<FlightDocument> findAll(Pageable pageable);

    List<FlightDocument> findByDepartureTimeBefore(LocalDateTime time);

}
