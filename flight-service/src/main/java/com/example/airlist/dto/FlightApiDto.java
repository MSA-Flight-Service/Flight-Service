package com.example.airlist.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlightApiDto {

    private String departure;
    private String arrival;
    private String departureTime;
    private String arrivalTime;
    private String flightClass;

    //아래는 직접넣지 않지만 변환시 생성됨
    private String aircraftType;
    private int seatCount;

}
