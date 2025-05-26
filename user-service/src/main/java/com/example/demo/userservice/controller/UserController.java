package com.example.demo.userservice.controller;

import com.example.demo.userservice.dto.UserUpdateDTO;
import com.example.demo.userservice.entity.UserEntity;
import com.example.demo.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "유저 목록 조회", description = "등록된 모든 유저를 가져옵니다.")
    public ResponseEntity<List<UserEntity>> findAll() {
        List<UserEntity> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "유저 ID로 유저 검색", description = "ID로 검색된 유저를 가져옵니다.")
    public ResponseEntity<UserEntity> findById(@PathVariable Long id) {
        Optional<UserEntity> user = userService.findById(id);
        return ResponseEntity.ok(user.orElse(null));
    }
    @PostMapping("/find-id")
    public ResponseEntity<Map<String, String>> findId(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");

        if (phone == null || phone.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "핸드폰 번호를 입력해주세요."));
        }

        String foundId = userService.findIdByPhone(phone);
        if (foundId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "아이디를 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(Collections.singletonMap("foundId", foundId));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "이메일과 새 비밀번호를 입력해주세요."));
        }

        boolean success = userService.resetPassword(email, newPassword);

        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "등록된 사용자를 찾을 수 없습니다."));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "비밀번호 재설정에 성공했습니다."));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "유저 이메일로 유저 찾기", description = "이메일로 검색된 유저를 가져옵니다.")
    public ResponseEntity<UserEntity> findByEmail(@PathVariable String email) {
        Optional<UserEntity> user = userService.findByEmail(email);
        return ResponseEntity.ok(user.orElse(null));
    }

    @PostMapping
    @Operation(summary = "유저 등록", description = "넘겨받은 객체로 유저를 등록합니다.")
    public ResponseEntity<UserEntity> create(@RequestBody UserEntity user) {
        UserEntity createdUser = userService.createUser(user);
        return ResponseEntity.status(201).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userDTO) {
        System.out.println(userDTO);
        System.out.println(id);
        Optional<UserEntity> existingUserOpt = userService.findById(id);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "사용자를 찾을 수 없습니다."));
        }
        UserEntity updatedUser = userService.updateUser(existingUserOpt.get(), userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "유저 삭제", description = "ID에 해당하는 유저를 삭제합니다.")
    public ResponseEntity<UserEntity> delete(@PathVariable Long id) {
        return userService.deleteUser(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
