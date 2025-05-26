package com.example.airlist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) // 📌 알 수 없는 필드 무시!
public class FlightsResponse {
    private int currentCount;
    private List<FlightJsonDto> data;
}