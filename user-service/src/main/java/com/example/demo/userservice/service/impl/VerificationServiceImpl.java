package com.example.demo.userservice.service.impl;

import com.example.demo.userservice.entity.EmailVerification;
import com.example.demo.userservice.repository.EmailVerificationRepository;
import com.example.demo.userservice.service.EmailService;
import com.example.demo.userservice.service.VerificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VerificationServiceImpl implements VerificationService {
    private final EmailService emailService;
    private final EmailVerificationRepository verificationRepository;

    public VerificationServiceImpl(EmailService emailService, EmailVerificationRepository verificationRepository) {
        this.emailService = emailService;
        this.verificationRepository = verificationRepository;
    }
    // 6자리 인증 코드를 생성합니다.
    private String generateVerificationCode() {
        int code = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(code);
    }

    // 이메일로 인증 코드를 생성하여 전송하는 메서드
    public void sendVerificationCode(String email) {
        String code = generateVerificationCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15); // 15분 유효

        // 이미 해당 이메일에 대한 기록이 있다면 업데이트, 없으면 새로 생성
        EmailVerification verification = verificationRepository.findByEmail(email);
        if (verification == null) {
            verification = new EmailVerification(email, code, expiry);
        } else {
            verification.setVerificationCode(code);
            verification.setExpiryDate(expiry);
        }
        verificationRepository.save(verification);

        // 이메일 전송 서비스 호출
        emailService.sendVerificationEmail(email, code);
    }

    // 클라이언트가 보낸 코드를 검증하는 메서드
    public boolean verifyCode(String email, String code) {
        EmailVerification verification = verificationRepository.findByEmail(email);
        if (verification == null) {
            return false;
        }
        // 만료시간 체크
        if (verification.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        // 코드 일치 여부 체크
        if (verification.getVerificationCode().equals(code)) {
            // 인증 성공 시, 레코드 삭제 혹은 상태 변경 (여기서는 삭제)
            verificationRepository.delete(verification);
            return true;
        }
        return false;
    }
}
