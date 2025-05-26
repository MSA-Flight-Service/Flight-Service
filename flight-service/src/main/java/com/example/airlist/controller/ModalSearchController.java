package com.example.airlist.controller;

import com.example.airlist.service.elastic.AirPortEsCombine;
import com.example.airlist.service.elastic.AirportEsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/autocomplete")
public class ModalSearchController {

    private final AirPortEsCombine flightSearch;
    public ModalSearchController(AirPortEsCombine flightSearch) {
        this.flightSearch = flightSearch;
    }


    @GetMapping
    public List<Map<String,String>> autocomplete(@RequestParam String keyword , HttpServletRequest request) throws IOException {
        String ip = request.getRemoteAddr(); //클라이언트 IP 추출
        return flightSearch.searchWithLog(keyword,ip);
    }
}
