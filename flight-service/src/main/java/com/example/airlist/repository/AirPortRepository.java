package com.example.airlist.repository;

import com.example.airlist.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirPortRepository extends JpaRepository<Airport, Long> {
}
