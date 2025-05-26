package com.example.airlist.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "a_id")
    private Long id;

    @Column(name = "a_code", length = 10)
    private String code; // GMP, ICN 등

    @Column(name = "a_namek", nullable = false)
    private String nameKorean; // 김포국제공항

    @Column(name = "continent", nullable = false)
    private String continent; // asia, europe 등

}
