package com.example.demo.reservationservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SeatDTO {

    @JsonProperty("sId")
    private Long sId;

    @JsonProperty("sName")
    private String sName;

    @JsonProperty("sPassPortNum")
    private String sPassPortNum;

    @JsonProperty("sSpot")
    private String sSpot;

    @JsonProperty("sClass")
    private String sClass;

    @JsonProperty("sPrice")
    private int sPrice;
}
