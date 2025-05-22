package com.example.airlist.service.elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.example.airlist.entity.Airport;
import com.example.airlist.entity.AirportDocument;
import com.example.airlist.repository.AirPortRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportEsIndexer {
    private final AirPortRepository airportRepository;
    private final ElasticsearchClient esClient;

    public AirportEsIndexer(AirPortRepository airportRepository, ElasticsearchClient esClient) {
        this.airportRepository = airportRepository;
        this.esClient = esClient;
    }


    public void indexAll() {
        List<Airport> airports = airportRepository.findAll();
        System.out.println("공항 개수: " + airports.size());

        for (Airport airport : airports) {
            AirportDocument doc = AirportDocument.builder()
                    .id(String.valueOf(airport.getId()))
                    .code(airport.getCode())
                    .nameKo(airport.getNameKorean())
                    .continent(airport.getContinent())
                    .build();

            try {
                esClient.index(i -> i
                        .index("airports")
                        .id(doc.getId())
                        .document(doc)
                );
            } catch (Exception e) {
                System.err.println("❌ 색인 실패: " + doc.getId());
                e.printStackTrace();
            }
        }

        System.out.println("✅ 공항 색인 완료");
    }

}
