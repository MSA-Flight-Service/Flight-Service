package com.example.demo.reservationservice.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TimedStorage {

    // RedisTemplate은 설정된 직렬화 방식 (JSON)을 사용함
    private final RedisTemplate<String, Object> reservationRedisTemplate;

    // 데이터 유효시간: 15분
    private static final Duration TTL = Duration.ofMinutes(15);
    private static final Duration LOCK_TTL = Duration.ofMinutes(5); // 좌석 락 5분 유지

    /**
     * Redis에 데이터 저장 (15분 뒤 자동 삭제됨)
     * @param key 저장할 키
     * @param request 저장할 객체
     */
    public void put(String key, Object request) {
        ValueOperations<String, Object> ops = reservationRedisTemplate.opsForValue();
        ops.set(key, request, TTL);  // TTL 설정
        System.out.println("저장 완료"+ key);
    }

    /**
     * Redis에서 데이터 조회
     * @param key 조회할 키
     * @return 존재할 경우 ReservationRequest, 없으면 null
     */
    public Object get(String key) {
        return reservationRedisTemplate.opsForValue().get(key);
    }

    /**
     * flightId에 대해 락 중인 모든 좌석 키를 조회하고,
     * 그 중 좌석 번호만 파싱해서 반환합니다.
     *
     * @param fId 항공편 ID
     * @return 락 중인 좌석번호 리스트 (e.g. ["A1", "B2", ...])
     */
    public List<String> getLockedSpotsByFlight(Long fId) {
        // lockKey 패턴: lock:{flightId}:*
        String pattern = "lock:" + fId + ":*";

        // 1. Redis에서 패턴에 맞는 키들 조회
        Set<String> keys = reservationRedisTemplate.keys(pattern);
        if (keys == null || keys.isEmpty()) {
            return List.of();
        }

        // 2. 키값에서 seatNo 부분만 파싱 ("lock:{flightId}:{seatNo}")
        return keys.stream()
                .map(key -> {
                    // "lock:123:A1" → split(":") → ["lock","123","A1"]
                    String[] parts = key.split(":");
                    return parts.length == 3 ? parts[2] : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * 좌석 락 시도 - 락 성공시 true, 이미 잠김 상태면 false
     */
    public boolean tryLockSeat(Long flightId, String seatNo) {
        String lockKey = "lock:" + flightId + ":" + seatNo;
        Boolean success = reservationRedisTemplate.opsForValue().setIfAbsent(lockKey, "LOCKED", LOCK_TTL);

        if (Boolean.TRUE.equals(success)) {
            System.out.println("🔒 좌석 락 성공: " + seatNo);
            return true;
        } else {
            System.out.println("❌ 좌석 이미 사용중: " + seatNo);
            return false;
        }
    }

    /**
     * 좌석 락 해제 (예매 완료 또는 취소 시 호출)
     */
    public void releaseSeatLock(Long flightId, String seatNo) {
        String lockKey = "lock:" + flightId + ":" + seatNo;
        reservationRedisTemplate.delete(lockKey);
        System.out.println("🔓 좌석 락 해제: " + seatNo);
    }

    public void remove(String key) {
        reservationRedisTemplate.delete(key);
    }
}
