package com.example.demo.reservationservice.controller;

import com.example.demo.reservationservice.dto.PaymentStatusResponse;
import com.example.demo.reservationservice.entitiy.Payment;
import com.example.demo.reservationservice.entitiy.Reservation;
import com.example.demo.reservationservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reservations/payments")
@RequiredArgsConstructor
public class PayController {

    private final PaymentService paymentService;

    @PostMapping("/virtual/{rId}")
    public ResponseEntity<Payment> virtualPayment(@PathVariable Long rId, @RequestParam Long uId) {
        return paymentService.createVirtualPayment(rId, uId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    @PostMapping("/virtual/by-group")
    public ResponseEntity<Payment> virtualPaymentByGroup(@RequestParam Long uId, @RequestParam String groupId) {
        return paymentService.createGroupPayment(uId, groupId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentId));
    }

    @GetMapping("/{paymentId}/reservations")
    public ResponseEntity<List<Reservation>> getReservationsByPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getReservationsByPaymentId(paymentId));
    }

    @DeleteMapping("/reservation/{rId}")
    public ResponseEntity<?> deleteSingleReservation(@PathVariable Long rId) {
        try {
            paymentService.deleteSingleReservation(rId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/reservations/by-group")
    public ResponseEntity<?> deleteReservationsByGroup(@RequestParam Long uId, @RequestParam String groupId) {
        try {
            paymentService.deleteReservationsByGroup(uId, groupId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check-paid")
    public ResponseEntity<Map<Long, Boolean>> checkReservationsPaid(@RequestParam List<Long> rIds) {
        return ResponseEntity.ok(paymentService.checkReservationsPaid(rIds));
    }
}