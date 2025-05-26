package com.example.demo.userservice.service.impl;

import com.example.demo.userservice.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendVerificationEmail(String toEmail, String code) {
        String subject = "회원가입 이메일 인증 코드";
        String body = "회원가입 인증을 위해 다음 코드를 입력해주세요: " + code;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("parksill077@gmail.com"); // 실제 사용 가능한 발신자 이메일로 교체
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
