package com.example.airlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AirListApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirListApplication.class, args);
    }

}
