package com.example.airlist.service.Sceduler;

import com.example.airlist.entity.FlightDocument;
import com.example.airlist.repository.FlightInfoRepository;
import com.example.airlist.repository.FlightSearchRepositroy;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightCleanUpScheduler {

    private final FlightInfoRepository flightInfoRepository;

    private final FlightSearchRepositroy flightSearchRepositroy;

    public FlightCleanUpScheduler(FlightInfoRepository flightInfoRepository, FlightSearchRepositroy flightSearchRepositroy) {
        this.flightInfoRepository = flightInfoRepository;
        this.flightSearchRepositroy = flightSearchRepositroy;
    }

    @Scheduled(fixedDelay = 2 * 60 * 1000) //2분마다 삭제
    @Transactional
    public void removePastFLights() {

        //1. RDB에서 삭제
        LocalDateTime now = LocalDateTime.now();
        int deleteCount = flightInfoRepository.deleteByDepartureTimeBefore(now);
        System.out.println("스케줄러 " + deleteCount);

        // 2. Elasticsearch에서 departureTime 이전 항공편 삭제
        List<FlightDocument> expiredDocs = flightSearchRepositroy.findByDepartureTimeBefore(now);
        flightSearchRepositroy.deleteAll(expiredDocs);
        System.out.println("❌ [Elasticsearch 삭제 완료] " + expiredDocs.size() + "건");

    }
}
