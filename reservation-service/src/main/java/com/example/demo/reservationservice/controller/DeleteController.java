package com.example.demo.reservationservice.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.reservationservice.entitiy.DeletedReservation;
import com.example.demo.reservationservice.repository.DeletedReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deleted-reservations")
@RequiredArgsConstructor
public class DeleteController {

    private final DeletedReservationRepository deletedReservationRepository;

    @PostConstruct
    public void init() {
        System.out.println("🟢 DeletedReservationController LOADED");
    }

    @GetMapping
    public List<DeletedReservation> getByUId(@RequestParam Long uId) {
        return deletedReservationRepository.findByUIdAndIsCheckedFalse(uId);
    }

    @PutMapping("/mark-checked")
    public ResponseEntity<Void> markAsChecked(@RequestParam Long uId) {
        List<DeletedReservation> list = deletedReservationRepository.findByUIdAndIsCheckedFalse(uId);
        list.forEach(r -> r.setChecked(true));
        deletedReservationRepository.saveAll(list);
        return ResponseEntity.ok().build();
    }
}
