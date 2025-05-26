package com.example.demo.reservationservice.repository;
import com.example.demo.reservationservice.entitiy.Reservation;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 특정 항공편(fId)의 예매 좌석 위치(sSpot) 조회
    @Query("SELECT r.sSpot FROM Reservation r WHERE r.fId = :fId")
    List<String> findReservationSSpotByFId(@Param("fId") Long fId);

    // rId로 예매 단일 조회
    @Query("SELECT r FROM Reservation r WHERE r.rId = :rId")
    Optional<Reservation> findByRId(@Param("rId") Long rId);

    // uId로 모든 예매 목록 조회
    @Query("SELECT r FROM Reservation r WHERE r.uId = :uId")
    List<Reservation> findByUId(@Param("uId") Long uId);

    // uId + groupId 조건, 아직 결제되지 않은 예매들 조회
    @Query("SELECT r FROM Reservation r WHERE r.uId = :uId AND r.groupId = :groupId AND r.payment IS NULL")
    List<Reservation> findByUIdAndGroupIdAndPaymentIsNull(@Param("uId") Long uId, @Param("groupId") String groupId);

    // rId로 예매 조회
    @Modifying
    @Transactional
    @Query("DELETE FROM Reservation r WHERE r.rId = :rId")
    void deleteByRId(@Param("rId") Long rId);

    // paymentId로 연결된 예매 목록 조회
    @Query("SELECT r FROM Reservation r WHERE r.payment.paymentId = :paymentId")
    List<Reservation> findByPaymentId(@Param("paymentId") Long paymentId);

    //uId와 groupId로 예매 조회
    @Query("SELECT r FROM Reservation r WHERE r.uId = :uId AND r.groupId = :groupId")
    List<Reservation> findByUIdAndGroupId(@Param("uId") Long uId, @Param("groupId") String groupId);

    @Query("SELECT r FROM Reservation r WHERE r.payment IS NULL AND r.rDate < :threshold")
    List<Reservation> findExpiredUnpaidReservations(@Param("threshold") LocalDateTime threshold);
}
