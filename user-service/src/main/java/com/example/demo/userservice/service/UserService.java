package com.example.demo.userservice.service;

import com.example.demo.userservice.dto.UserUpdateDTO;
import com.example.demo.userservice.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserEntity> findAll();
    UserEntity save(UserEntity user);
    List<UserEntity> findUserByIdIncludeDeleted();
    Optional<UserEntity> findById(Long id);
    String findIdByPhone(String phone);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> updatePass(String email, String password);
    UserEntity createUser(UserEntity user);
    UserEntity updateUser(UserEntity user, UserUpdateDTO userDTO);
    boolean deleteUser(Long id);
    boolean resetPassword(String email, String newPassword);
    void scheduleHardDelete();
}
