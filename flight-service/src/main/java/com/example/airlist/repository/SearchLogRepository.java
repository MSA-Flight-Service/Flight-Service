package com.example.airlist.repository;

import com.example.airlist.entity.SearchLog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SearchLogRepository  extends JpaRepository<SearchLog,Long> {
    List<SearchLog> findTop10ByUserIdOrderBySearchedAtDesc(String userId);
}
