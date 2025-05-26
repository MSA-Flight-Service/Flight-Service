package com.example.airlist.service.elastic;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AirPortEsCombine {

    private final AirportEsService airportEsService;
    private final SearchLogEsService searchLogEsService;

    public AirPortEsCombine(AirportEsService airportEsService, SearchLogEsService searchLogEsService) {
        this.airportEsService = airportEsService;
        this.searchLogEsService = searchLogEsService;
    }

    public List<Map<String, String>> searchWithLog(String keyword, String ip) throws IOException {
        // 1. 검색 실행
        List<Map<String, String>> result = airportEsService.autocomplete(keyword);

        // 2. 로그 저장
        searchLogEsService.logSearch(keyword, ip);

        return result;
    }
}
