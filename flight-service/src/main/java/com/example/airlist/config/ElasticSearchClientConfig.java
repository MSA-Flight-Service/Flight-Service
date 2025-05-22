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

        //Jackson 설정
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // ElasitcSerach 용 JSON MAPPER
        JacksonJsonpMapper jacksonJsonpMapper = new JacksonJsonpMapper(objectMapper);

        //기본 RestCLient

        RestClient restClient  = RestClient.builder(
                new HttpHost("elasticsearch", 9200)
        ).build();

        // transport 연결
        ElasticsearchTransport transport = new RestClientTransport(restClient, jacksonJsonpMapper);

        //최종 클라이언트
        return new ElasticsearchClient(transport);
    }
}
