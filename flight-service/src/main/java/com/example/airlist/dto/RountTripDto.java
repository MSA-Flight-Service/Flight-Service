package com.example.airlist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RountTripDto {
    private FlightDto go;
    private FlightDto back;
}
