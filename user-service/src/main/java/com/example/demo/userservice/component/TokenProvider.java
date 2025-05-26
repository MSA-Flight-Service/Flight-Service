package com.example.demo.userservice.component;

import io.jsonwebtoken.Claims;

public interface TokenProvider {
    /**
     * 지정된 이메일과 역할 정보를 바탕으로 JWT를 생성합니다.
     */
    String createToken(String email);
    /**
     * 토큰의 유효기간(밀리초 단위)을 반환합니다.
     */
    long getValidityInMillis();
    /**
     * 토큰의 유효성을 검증합니다.
     */
    boolean validateToken(String token);
    /**
     * JWT에서 이메일(Subject) 정보를 추출합니다.
     */
    String getEmailFromToken(String token);

    Claims getClaimsFromToken(String token);
}
