package com.example.airlist.service.elastic;

import com.example.airlist.entity.SearchLog;
import com.example.airlist.repository.SearchLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SearchLogEsService {

    private final SearchLogRepository searchLogRepository;
    public SearchLogEsService(SearchLogRepository searchLogRepository) {
        this.searchLogRepository = searchLogRepository;
    }

    public void logSearch(String keyword, String ip) {
        SearchLog log =new SearchLog();
        log.setKeyword(keyword);
        log.setIp(ip);
        log.setSearchedAt(LocalDateTime.now());

        searchLogRepository.save(log);
    }


}
