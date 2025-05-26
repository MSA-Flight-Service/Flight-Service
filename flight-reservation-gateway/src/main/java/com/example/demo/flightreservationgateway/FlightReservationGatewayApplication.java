package com.example.demo.flightreservationgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class FlightReservationGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlightReservationGatewayApplication.class, args);
    }

}
