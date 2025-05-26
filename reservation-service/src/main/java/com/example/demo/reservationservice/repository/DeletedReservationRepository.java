package com.example.demo.reservationservice.repository;

import com.example.demo.reservationservice.entitiy.DeletedReservation;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeletedReservationRepository extends JpaRepository<DeletedReservation, Long> {
    @Query("SELECT d FROM  DeletedReservation d WHERE d.uId = :uId")
    List<DeletedReservation> findByUId(@Param("uId") Long uId);

    List<DeletedReservation> findByUIdAndIsCheckedFalse(Long uId);
}
