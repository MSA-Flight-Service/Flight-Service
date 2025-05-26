package com.example.demo.reservationservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ReservationDTO {

    @JsonProperty("rId")
    private Long rId;

    @JsonProperty("fId")
    private Long fId;

    @JsonProperty("uId")
    private Long uId;

    @JsonProperty("rDate")
    private LocalDateTime rDate;

    @JsonProperty("fSeatCount")
    private int fSeatCount;

    @JsonProperty("fDeparture")
    private String fDeparture;

    @JsonProperty("fArrival")
    private String fArrival;

    @JsonProperty("fDepartureTime")
    private LocalDateTime fDepartureTime;

    @JsonProperty("fArrivalTime")
    private LocalDateTime fArrivalTime;

    @JsonProperty("fAircraftType")
    private String fAircraftType;

    @JsonProperty("cId")
    private Long cId;

    @JsonProperty("uName")
    private String uName;

    @JsonProperty("totalPrice")
    private int totalPrice;
}
