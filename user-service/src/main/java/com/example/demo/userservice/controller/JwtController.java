package com.example.demo.userservice.controller;

import com.example.demo.userservice.dto.TokenInfoResponse;
import com.example.demo.userservice.exception.AuthException;
import com.example.demo.userservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class JwtController {

    private final AuthService authService;
    public JwtController(AuthService authService) {
        this.authService = authService;
    }
    @GetMapping("/decodeEmail")
    public ResponseEntity<String> decodeToken(HttpServletRequest request) {
        String token = authService.resolveToken(request);
        if(token == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        try {
            String email = authService.getEmailFromToken(token);
            return ResponseEntity.ok(email);
        } catch (AuthException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/token-info")
    public ResponseEntity<?> getTokenInfo(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        // 헤더에 토큰이 없거나 'Bearer ' 형식이 아니면 잘못된 요청으로 처리
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Authorization header is missing or invalid.");
        }
        // "Bearer " 접두어 제거
        String token = authorizationHeader.substring(7);

        // 토큰으로부터 사용자 ID와 admin 여부 추출
        Long userId = authService.getUserIdFromToken(token);
        Boolean isAdmin = authService.isAdminFromToken(token);
        String email = authService.getEmailFromToken(token);

        // DTO를 통해 응답 객체 생성
        TokenInfoResponse response = new TokenInfoResponse(userId, isAdmin, email);
        System.out.println(response.toString());
        return ResponseEntity.ok(response);
    }
}
