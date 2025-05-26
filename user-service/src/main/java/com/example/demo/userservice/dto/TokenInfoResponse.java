package com.example.demo.userservice.dto;

public class TokenInfoResponse {
    private Long userId;
    private Boolean isAdmin;
    private String email;

    public TokenInfoResponse() {}

    public TokenInfoResponse(Long userId, Boolean isAdmin, String email) {
        this.userId = userId;
        this.isAdmin = isAdmin;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "TokenInfoResponse{" +
                "userId=" + userId +
                ", isAdmin=" + isAdmin +
                ", email='" + email + '\'' +
                '}';
    }
}
