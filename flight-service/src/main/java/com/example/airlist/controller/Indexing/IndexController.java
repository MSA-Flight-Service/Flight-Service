package com.example.airlist.controller.Indexing;

import com.example.airlist.service.elastic.AirportEsIndexer;
import com.example.airlist.service.elastic.FlightEsIndexer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    private final FlightEsIndexer indexer;
    private final AirportEsIndexer indexer1;
    public IndexController(FlightEsIndexer indexer, AirportEsIndexer indexer1) {
        this.indexer = indexer;
        this.indexer1 = indexer1;
    }


    @GetMapping("/api/index")
    public String indexData() {
        indexer.indexAll();
        indexer1.indexAll();
        return "인덱싱 완료!";
    }
}
