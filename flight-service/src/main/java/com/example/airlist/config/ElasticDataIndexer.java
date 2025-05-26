package com.example.airlist.config;

import com.example.airlist.service.elastic.AirportEsIndexer;
import com.example.airlist.service.elastic.FlightEsIndexer;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ElasticDataIndexer implements org.springframework.boot.ApplicationRunner {

    private final AirportEsIndexer airportEsIndexer;
    private final FlightEsIndexer flightEsIndexer;

    @Override
    @Transactional
    public void run(org.springframework.boot.ApplicationArguments args) {
        airportEsIndexer.indexAll();
        flightEsIndexer.indexAll();
        System.out.println("✅ Elasticsearch 자동 색인 완료!");
    }
}