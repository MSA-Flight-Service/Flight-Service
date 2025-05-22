package com.example.airlist.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class ElasticIndexInitializer {

    private final ElasticsearchClient esClient;

    @PostConstruct
    public void createIndexIfNotExists() throws IOException {
        boolean exists = esClient.indices().exists(b -> b.index("airports")).value();
        if (!exists) {
            InputStream inputStream = new ClassPathResource("es/airports.settings.json").getInputStream();
            String settingsJson = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            esClient.indices().create(c -> c
                    .index("airports")
                    .withJson(new StringReader(settingsJson))
            );

            System.out.println("✅ airports 인덱스 자동 생성 완료!");
        }
    }
}