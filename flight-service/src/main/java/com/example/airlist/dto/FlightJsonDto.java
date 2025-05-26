package com.example.airlist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) // ✅ 혹시 빠진 필드 있더라도 무시
public class FlightJsonDto {

    @JsonProperty("UFID")
    private String ufid;

    @JsonProperty("AIRLINE_KOREAN")
    private String airlineKorean;

    @JsonProperty("AIRLINE_ENGLISH")
    private String airlineEnglish;

    @JsonProperty("AIRPORT")
    private String airport;

    @JsonProperty("AIR_FLN")
    private String airFln;

    @JsonProperty("ARRIVED_KOR")
    private String arrivedKor;

    @JsonProperty("ARRIVED_ENG")
    private String arrivedEng; // ✅ 이거 추가!

    @JsonProperty("BOARDING_KOR")
    private String boardingKor;

    @JsonProperty("CITY")
    private String city;

    @JsonProperty("ETD")
    private String etd;

    @JsonProperty("FLIGHT_DATE")
    private String flightDate;

    @JsonProperty("LINE")
    private String line;

    @JsonProperty("RMK_KOR")
    private String rmkKor;

    @JsonProperty("STD")
    private String std;

    @JsonProperty("IO")
    private String io;

}
