package com.example.demo.userservice.controller;

import com.example.demo.userservice.dto.LoginRequest;
import com.example.demo.userservice.exception.AuthException;
import com.example.demo.userservice.service.AuthService;
import com.example.demo.userservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            Map<String, Object> responseBody = authService.login(loginRequest, response);
            System.out.println(responseBody);
            return ResponseEntity.ok(responseBody);
        } catch (AuthException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String message = authService.logout(request, response);
            return ResponseEntity.ok(message);
        } catch (AuthException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
    }


    /**
     * HTTPOnly refresh 토큰을 이용하여 새 액세스 토큰을 발급합니다.
     *
     * refresh 토큰은 클라이언트측에서 직접 접근할 수 없으므로,
     * 브라우저가 자동으로 쿠키에 저장된 값을 전송합니다.
     *
     * @param refreshToken HTTPOnly refresh 토큰 (쿠키에서 추출)
     * @return 새 액세스 토큰을 포함한 JSON 응답
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        String newAccessToken = authService.refreshAccessToken(refreshToken);
        System.out.println("New access token: " + newAccessToken);
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("accessToken", newAccessToken);

        return ResponseEntity.ok(tokenMap);
    }
}