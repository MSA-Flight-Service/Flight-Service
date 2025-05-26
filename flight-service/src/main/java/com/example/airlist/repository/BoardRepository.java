package com.example.airlist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.airlist.entity.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

}

