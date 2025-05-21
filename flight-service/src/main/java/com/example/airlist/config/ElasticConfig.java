package com.example.airlist.config;


import com.example.airlist.service.AirportIndexer;
import com.example.airlist.service.FlightElasticIndexer;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class ElasticConfig implements ApplicationRunner {

    private final FlightElasticIndexer indexer;
    private final AirportIndexer indexer1;
    public ElasticConfig(FlightElasticIndexer indexer, AirportIndexer indexer1) {
        this.indexer = indexer;
        this.indexer1 = indexer1;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            indexer.indexAll();
            indexer1.indexAll();
            System.out.println("✅ 자동 인덱싱 완료");
        } catch (Exception e) {
            System.err.println("❌ 인덱싱 실패: " + e.getMessage());
        }
    }
}





