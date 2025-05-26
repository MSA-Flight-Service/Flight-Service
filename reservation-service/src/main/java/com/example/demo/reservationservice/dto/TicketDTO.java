package com.example.demo.reservationservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketDTO {
    @JsonProperty("r_id")
    private Long rId;

    @JsonProperty("u_id")
    private Long uId;

    @JsonProperty("f_id")
    private Long fId;

    @JsonProperty("r_date")
    private LocalDateTime rDate;

    @JsonProperty("f_departure")
    private String fDeparture;

    @JsonProperty("f_arrival")
    private String fArrival;

    @JsonProperty("f_departure_time")
    private LocalDateTime fDepartureTime;

    @JsonProperty("f_arrival_time")
    private LocalDateTime fArrivalTime;

    @JsonProperty("c_id")
    private Long cId;

    @JsonProperty("a_name")
    private String aName;

    @JsonProperty("u_name")
    private String uName;

    @JsonProperty("s_name")
    private String sName;

    @JsonProperty("s_spot")
    private String sSpot;

    @JsonProperty("s_class")
    private String sClass;
}
