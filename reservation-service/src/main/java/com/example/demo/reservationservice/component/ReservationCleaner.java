package com.example.demo.reservationservice.component;

import com.example.demo.reservationservice.entitiy.DeletedReservation;
import com.example.demo.reservationservice.entitiy.Reservation;
import com.example.demo.reservationservice.repository.DeletedReservationRepository;
import com.example.demo.reservationservice.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationCleaner {

    private final ReservationRepository reservationRepository;
    private final DeletedReservationRepository deletedRepo;

    // ⏱ 매 10초마다 실행 (테스트용)
    @Scheduled(fixedDelay =  60 * 60 * 1000)
    public void cleanExpiredReservations() {
        LocalDateTime limit = LocalDateTime.now().minusDays(3); // 테스트 기준 10초

        List<Reservation> expired = reservationRepository.findExpiredUnpaidReservations(limit);
        if (!expired.isEmpty()) {
            for (Reservation r : expired) {
                deletedRepo.save(DeletedReservation.builder()
                        .uId(r.getUId())
                        .groupId(r.getGroupId())
                        .reason("미결제 자동 삭제")
                        .deletedAt(LocalDateTime.now())
                        .build());
            }

            reservationRepository.deleteAll(expired);
            System.out.println("🧹 자동 삭제된 미결제 예약 수: " + expired.size());
        }
    }
}
