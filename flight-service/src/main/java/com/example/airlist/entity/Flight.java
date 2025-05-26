package com.example.airlist.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {  //공공데이터 API 로 가져오는 원본 테이블

    @Id
    private String ufid;

    private String airlineKorean;
    private String airlineEnglish;
    private String airport;
    private String airFln;
    private String arrivedKor;
    private String boardingKor;
    private String city;
    private String etd;
    private String std;
    private String flightDate;
    private String line;
    private String rmkKor;
    private String io;  // "I" 또는 "O"

}
