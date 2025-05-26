package com.example.demo.userservice.repository;

import com.example.demo.userservice.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    EmailVerification findByEmail(String email);
}