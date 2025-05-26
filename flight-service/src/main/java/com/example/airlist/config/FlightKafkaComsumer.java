package com.example.airlist.config;

import com.example.airlist.dto.FlightDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class FlightKafkaComsumer {

    @KafkaListener(topics = "flight-topic", groupId = "flight-consumer-group")
    public void listen(String message){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            FlightDto dto = objectMapper.readValue(message,FlightDto.class);
            System.out.println(dto);
        }catch (Exception e){
            e.printStackTrace();
        }

    }
}
