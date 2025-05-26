package com.example.demo.reservationservice.repository;

import com.example.demo.reservationservice.entitiy.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}

