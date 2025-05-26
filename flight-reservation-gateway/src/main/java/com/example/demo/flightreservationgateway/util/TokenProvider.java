package com.example.demo.flightreservationgateway.util;

public interface TokenProvider {
    boolean validateToken(String token);
    String getEmailFromToken(String token);
}
