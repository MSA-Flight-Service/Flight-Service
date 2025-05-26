package com.example.airlist.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AirportDocument {
    String id;        // 공항 ID (String 타입으로 변환)
    String code;      // ex) GMP
    String nameKo;    // ex) 김포국제공항
    String continent; // ex) asia

    @Builder.Default
    private int searchCount = 0;
}
