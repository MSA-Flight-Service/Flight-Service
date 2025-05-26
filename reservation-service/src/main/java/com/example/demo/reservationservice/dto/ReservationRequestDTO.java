    package com.example.demo.reservationservice.dto;

    import com.fasterxml.jackson.annotation.JsonProperty;
    import lombok.*;

    import java.util.List;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public class ReservationRequestDTO {

        @JsonProperty("reservation")
        private ReservationDTO reservation;

    
        @JsonProperty("seats")
        private List<SeatDTO> seats;
    }
