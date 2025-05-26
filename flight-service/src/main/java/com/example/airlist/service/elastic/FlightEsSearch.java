package com.example.airlist.service.elastic;

import com.example.airlist.entity.FlightDocument;
import com.example.airlist.repository.FlightSearchRepositroy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class FlightEsSearch {

    private final FlightSearchRepositroy flightSearchRepositroy;
    private final RedisTemplate<String, Object> redisTemplate;

    public FlightEsSearch(FlightSearchRepositroy flightSearchRepositroy, RedisTemplate<String, Object> redisTemplate) {
        this.flightSearchRepositroy = flightSearchRepositroy;
        this.redisTemplate = redisTemplate;
    }

    public Page<FlightDocument> searchElastic(String departure, String arrival, LocalDateTime date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("departureTime").ascending());

        // 1. 캐시 키 생성
        String key = generateKey(departure, arrival, date, page, size);

        // 2. 캐시 조회
        Page<FlightDocument> cached = (Page<FlightDocument>) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return cached;
        }

        // 3. ES 검색
        Page<FlightDocument> result;
        if (date == null) {
            result = flightSearchRepositroy.findByDepartureNameContainingAndArrivalNameContaining(departure, arrival, pageable);
        } else {
            result = flightSearchRepositroy.findByDepartureNameContainingAndArrivalNameContainingAndDepartureTimeAfter(departure, arrival, date, pageable);
        }

        // 4. 캐시에 저장 (TTL: 10분)
        redisTemplate.opsForValue().set(key, result, Duration.ofMinutes(10));

        return result;
    }

    public Page<FlightDocument> findAllPaged(Pageable pageable) {
        return flightSearchRepositroy.findAll(
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("departureTime").ascending())
        );
    }

    private String generateKey(String departure, String arrival, LocalDateTime date, int page, int size) {
        return "search::" + departure + "::" + arrival + "::" +
                (date != null ? date.toString() : "any") + "::p" + page + "::s" + size;
    }
}
