package com.example.airlist.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Document(indexName = "flights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightDocument {

    @Id
    private Long id;


    @Field(type = FieldType.Text)
    private String departureName; //김포국제공항

    @Field(type = FieldType.Keyword)
    private String departureCode; //GMP

    @Field(type = FieldType.Text)
    private String arrivalName; // 제주 국제 공항

    @Field(type = FieldType.Keyword)
    private String arrivalCode; // CJU

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    private String aircraftModel;   // ex: Boeing 737
    private int seatCount;          // 좌석 수
    private int price;
}
