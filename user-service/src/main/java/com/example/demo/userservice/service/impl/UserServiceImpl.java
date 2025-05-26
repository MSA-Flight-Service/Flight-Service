package com.example.demo.userservice.service.impl;

import com.example.demo.userservice.dto.UserUpdateDTO;
import com.example.demo.userservice.entity.UserEntity;
import com.example.demo.userservice.repository.UserRepository;
import com.example.demo.userservice.service.UserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    @Override
    public UserEntity save(UserEntity user) { return userRepository.save(user); }

    @Override
    public List<UserEntity> findUserByIdIncludeDeleted() {
        return userRepository.findUserByIdIncludeDeleted();
    }

    @Override
    public Optional<UserEntity> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<UserEntity> updatePass(String email, String password) {
        return Optional.empty();
    }

    @Override
    public String findIdByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .map(UserEntity::getEmail)
                .orElse(null);
    }

    @Override
    public boolean resetPassword(String email, String newPassword) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return false;
        }
        UserEntity user = optionalUser.get();
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return true;
    }


    @Override
    public UserEntity createUser(UserEntity user) {
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    @Override
    public UserEntity updateUser(UserEntity user, UserUpdateDTO userDTO) {
        user.setUserFirstName(userDTO.getUserFirstName());
        user.setUserLastName(userDTO.getUserLastName());
        user.setPhone(userDTO.getPhone());
        user.setBirthday(userDTO.getBirthday());
        user.setAddress(userDTO.getAddress());
        return userRepository.save(user);
    }

    @Override
    public boolean deleteUser(Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    @Override
    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleHardDelete() {
        // 현재 시간에서 한 달 전 날짜를 기준으로 설정
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(1);

        // 실제 삭제를 진행
        int deletedCount = userRepository.hardDeleteByDeletedBefore(cutoffDate);

        // 로그 출력 (적절한 로그 라이브러리 사용)
        System.out.println("하드 딜리트 완료 - 삭제된 사용자 수: " + deletedCount);
    }
}
