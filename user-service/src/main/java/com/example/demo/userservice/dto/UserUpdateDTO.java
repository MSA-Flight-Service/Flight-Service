package com.example.demo.userservice.dto;


import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class UserUpdateDTO {
    private String userFirstName;
    private String userLastName;
    private String phone;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
    private String address;

    // 기본 생성자
    public UserUpdateDTO() {}

    // Getter & Setter
    public String getUserFirstName() {
        return userFirstName;
    }
    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }
    public String getUserLastName() {
        return userLastName;
    }
    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public LocalDate getBirthday() {
        return birthday;
    }
    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}