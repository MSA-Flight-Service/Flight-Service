package com.example.demo.reservationservice.component;

import com.example.demo.reservationservice.dto.FlightDto;
import com.example.demo.reservationservice.dto.FlightReservationDto;
import com.example.demo.reservationservice.service.ReservationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class FlightKafkaConsumer {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "flight-topic", groupId = "flight-consumer-group")
    public void listen(String message) {
        try {
            FlightReservationDto dto = objectMapper.readValue(message, FlightReservationDto.class); // ✅ JSON → 객체
            redisTemplate.opsForValue().set(dto.getReservationId(), dto.getFlight(), Duration.ofMinutes(5));
            System.out.println("✅ Kafka 수신 → Redis 저장 완료: key=" + dto.getReservationId());
        } catch (JsonProcessingException e) {
            System.out.println("❌ Kafka 메시지 파싱 실패");
            e.printStackTrace();
        }
    }
}

