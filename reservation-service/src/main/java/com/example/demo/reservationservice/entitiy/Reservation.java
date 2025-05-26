    package com.example.demo.reservationservice.entitiy;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDateTime;

    @Data
    @Entity
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    @Access(AccessType.FIELD)
    @Table(name="reservation")
    public class Reservation {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "r_id", nullable = false)
        private Long rId;

        @Column(name = "u_id", nullable = false)
        private Long uId;

        @Column(name = "f_id", nullable = false)
        private Long fId;

        @Column(name = "r_date", nullable = false)
        private LocalDateTime rDate;

        @Column(name = "f_departure", nullable = false)
        private String fDeparture;

        @Column(name = "f_arrival", nullable = false)
        private String fArrival;

        @Column(name = "f_departure_time", nullable = false)
        private LocalDateTime fDepartureTime;

        @Column(name = "f_arrival_time", nullable = false)
        private LocalDateTime fArrivalTime;

        @Column(name = "c_id")
        private Long cId;

        @Column(name = "f_aircraft_type", nullable = false)
        private String fAircraftType;

        @Column(name = "u_name", nullable = false)
        private String uName;

        @Column(name = "s_name", nullable = false)
        private String sName;

        @Column(name = "s_spot", nullable = false)
        private String sSpot;

        @Column(name = "s_class", nullable = false)
        private String sClass;

        @Column(name = "ticket_price", nullable = false)
        private int ticketPrice;

        @Column(name= "group_id", nullable = false)
        private String groupId;

        @ManyToOne
        @JsonIgnore
        @JoinColumn(name = "payment_id", nullable = true) // 🔑 nullable = true
        private Payment payment;

    }
