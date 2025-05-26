package com.example.airlist.repository;

import com.example.airlist.entity.Flight_info;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface FlightInfoRepository extends JpaRepository<Flight_info, Long> {

    int deleteByDepartureTimeBefore(LocalDateTime now);

    

}
