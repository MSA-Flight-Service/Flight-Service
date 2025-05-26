package com.example.airlist.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight_info {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "f_id", nullable = false)
    private Long id;

    // ✅ 출발공항 - 다대일
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_airport_id", nullable = false)
    private Airport departure;

    // ✅ 도착공항 - 다대일
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_airport_id", nullable = false)
    private Airport arrival;

    @Column(name = "f_de_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "f_ar_time", nullable = false)
    private LocalDateTime arrivalTime;

    // ✅ 항공기 - 다대일
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private AirCraft aircraft;

    @Column(name = "f_seat", nullable = false)
    private int seatCount;
}
