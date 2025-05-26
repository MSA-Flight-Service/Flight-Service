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
public class AirCraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Long id;

    @Column(name = "c_Name")
    private String cName;
    @Column(name = "c_Line")
    private String cLine;
    @Column(name = "c_Seat")
    private Long cSeat;
    @Column(name = "c_Model")
    private String cModel;
}
