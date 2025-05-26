package com.example.demo.userservice.service;

import com.example.demo.userservice.dto.LoginRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

public interface AuthService {
    Map<String, Object> login(LoginRequest loginRequest, HttpServletResponse response);
    String logout(HttpServletRequest request, HttpServletResponse response);
    String resolveToken(HttpServletRequest request);
    String getEmailFromToken(String token);
    Long getUserIdFromToken(String token);
    Boolean isAdminFromToken(String token);
    String refreshAccessToken(String refreshToken);
}
