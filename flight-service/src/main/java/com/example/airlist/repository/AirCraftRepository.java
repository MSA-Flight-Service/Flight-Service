package com.example.airlist.repository;

import com.example.airlist.entity.AirCraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirCraftRepository extends JpaRepository<AirCraft, Long> {

}
