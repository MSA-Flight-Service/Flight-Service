package com.example.airlist.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;


@EnableKafka
@Configuration
public class KafkaComsumerConfig {
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() { //컨슈머 설정파일
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092"); //카프카 브로커 주소
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "flight-consumer-group"); //같은 그륩 ID를 가진 Comsumer들이 나눠서 소비하게 하라.
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class); //카프카 메세지의 Key를 문자열로 다시 리얼라이즈
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class); //카프카 메세지의 value도 문자열로 다시 리얼라잍즈

        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() { //카프카 메세지를 비동기적으로 여러개의쓰레드에서 처리할수있드록 컨테니어 팩토리 생성
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>(); //위에서 만든 consumerFactory를 설정하고 카프카 리스너에 연결
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
