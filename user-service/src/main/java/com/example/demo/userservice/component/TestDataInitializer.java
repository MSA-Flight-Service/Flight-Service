package com.example.demo.userservice.component;

import com.example.demo.userservice.entity.UserEntity;
import com.example.demo.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class TestDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public TestDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@example.com")) {
            UserEntity adminUser = new UserEntity();
            adminUser.setUserFirstName("Admin");
            adminUser.setUserLastName("User");

            // 비밀번호 암호화 처리
            adminUser.setPassword(passwordEncoder.encode("admin1234"));

            adminUser.setEmail("admin@example.com");
            adminUser.setPhone("01000000000");
            adminUser.setBirthday(LocalDate.of(1990, 1, 1));
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setAddress("Test Address");
            adminUser.setAdmin(true);

            userRepository.save(adminUser);
            System.out.println("✅ Admin 테스트 계정이 암호화된 비밀번호로 생성되었습니다.");
        }
    }
}
