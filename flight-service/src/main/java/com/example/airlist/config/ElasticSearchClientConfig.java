package com.example.airlist.config;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticSearchClientConfig {

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        try {
            RestClient restClient = RestClient.builder(
                    new HttpHost("elasticsearch", 9200)
            ).build();

            ElasticsearchTransport transport = new RestClientTransport(
                    restClient,
                    new JacksonJsonpMapper(new ObjectMapper()
                            .registerModule(new JavaTimeModule())
                            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS))
            );

            return new ElasticsearchClient(transport);

        } catch (Exception e) {
            // 로컬 테스트용 fallback 또는 로그 남기기
            System.err.println("Elasticsearch 연결 실패: " + e.getMessage());
            throw new RuntimeException("Elasticsearch 연결 실패", e);
        }
    }
}
