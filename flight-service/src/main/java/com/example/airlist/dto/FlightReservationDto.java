package com.example.airlist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightReservationDto {
    private String reservationId;
    private FlightDto flight;
}
