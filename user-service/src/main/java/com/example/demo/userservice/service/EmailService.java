package com.example.demo.userservice.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String code);

}
