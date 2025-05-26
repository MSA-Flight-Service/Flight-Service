package com.example.demo.reservationservice.controller;

import com.example.demo.reservationservice.entitiy.Reservation;
import com.example.demo.reservationservice.repository.ReservationRepository;
import com.example.demo.reservationservice.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminController {

    private final ReservationRepository reservationRepository;


    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @DeleteMapping("/{rId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long rId) {
        Reservation reservation = reservationRepository.findById(rId)
                .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));

        if (reservation.getPayment() != null) {
            return ResponseEntity.badRequest().body("❌ 결제된 예약은 삭제할 수 없습니다.");
        }

        reservationRepository.deleteById(rId);
        return ResponseEntity.ok("✅ 예약이 삭제되었습니다.");
    }
}
