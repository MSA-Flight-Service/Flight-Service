package com.example.demo.userservice.controller;

import com.example.demo.userservice.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserVerificationController {

    private final VerificationService verificationService;

    public UserVerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }
    // 이메일로 인증 코드 전송 API
    @PostMapping("/mail/send-verification")
    public ResponseEntity<Map<String, String>> sendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap("message", "이메일을 입력해주세요."));
        }
        verificationService.sendVerificationCode(email);
        return ResponseEntity.ok(Collections.singletonMap("message", "인증번호가 이메일로 전송되었습니다."));
    }

    // 클라이언트에서 입력한 인증 숫자를 검증하는 API
    @PostMapping("/mail/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String verificationCode = request.get("verificationCode");

        if (email == null || email.isEmpty() || verificationCode == null || verificationCode.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "이메일 및 인증번호를 입력해주세요."));
        }

        boolean success = verificationService.verifyCode(email, verificationCode);
        return ResponseEntity.ok(Collections.singletonMap("success", success));
    }
}
