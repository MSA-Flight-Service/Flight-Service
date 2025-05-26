package com.example.demo.userservice;

import com.example.demo.userservice.controller.UserController;
import com.example.demo.userservice.dto.LoginRequest;
import com.example.demo.userservice.entity.UserEntity;
import com.example.demo.userservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;


    @MockBean
    private RedisTemplate<String, Object> redisTemplate;

    @MockBean
    private ValueOperations<String, Object> valueOperations;

    @Autowired
    private ObjectMapper objectMapper;



    /**
     * 로그인 실패 테스트: 존재하지 않는 이메일로 요청 시
     */
    @Test
    @WithMockUser
    public void testLoginFailureInvalidEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("notfound@example.com");
        loginRequest.setPassword("password");

        // 이메일로 사용자를 찾지 못하는 경우
        when(userService.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        String jsonRequest = objectMapper.writeValueAsString(loginRequest);

        mockMvc.perform(post("/api/users/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid email"));
    }

    /**
     * 로그인 실패 테스트: 잘못된 비밀번호인 경우
     */
    @Test
    @WithMockUser
    public void testLoginFailureInvalidPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setUserFirstName("Test");
        user.setUserLastName("User");
        user.setEmail("test@example.com");
        user.setPhone("010-1234-5678");
        // 실제 저장된 비밀번호는 "password"
        user.setPassword("password");
        user.setCreatedAt(LocalDateTime.now());

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        String jsonRequest = objectMapper.writeValueAsString(loginRequest);

        mockMvc.perform(post("/api/users/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid password"));
    }



    /**
     * 로그아웃 실패 테스트: Authorization 헤더가 없거나 토큰이 유효하지 않은 경우
     */
    @Test
    @WithMockUser
    public void testLogoutFailureInvalidToken() throws Exception {
        // Authorization 헤더가 없는 경우
        mockMvc.perform(post("/api/users/logout")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid token"));
    }


    // 전체 사용자 조회 (GET /api/users)
    @Test
    @WithMockUser  // 인증된 사용자가 있다고 가정합니다.
    public void testFindAll() throws Exception {
        UserEntity user1 = new UserEntity();
        user1.setId(1L);
        user1.setUserFirstName("John");
        user1.setUserLastName("Doe");
        user1.setEmail("john@example.com");
        user1.setPhone("010-1234-5678");
        user1.setPassword("password");
        user1.setCreatedAt(LocalDateTime.now());

        UserEntity user2 = new UserEntity();
        user2.setId(2L);
        user2.setUserFirstName("Jane");
        user2.setUserLastName("Smith");
        user2.setEmail("jane@example.com");
        user2.setPhone("010-8765-4321");
        user2.setPassword("password");
        user2.setCreatedAt(LocalDateTime.now());

        when(userService.findAll()).thenReturn(Arrays.asList(user1, user2));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userFirstName").value("John"))
                .andExpect(jsonPath("$[1].userFirstName").value("Jane"));
    }

    // 단일 사용자 조회 (GET /api/users/{id})
    @Test
    @WithMockUser
    public void testFindById() throws Exception {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setUserFirstName("Alice");
        user.setUserLastName("Wonderland");
        user.setEmail("alice@example.com");
        user.setPhone("010-9999-8888");
        user.setPassword("password");
        user.setCreatedAt(LocalDateTime.now());

        when(userService.findById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userFirstName").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    // 사용자 생성 (POST /api/users)
    @Test
    @WithMockUser
    public void testCreateUser() throws Exception {
        UserEntity user = new UserEntity();
        user.setUserFirstName("Bob");
        user.setUserLastName("Marley");
        user.setEmail("bob@example.com");
        user.setPhone("010-5555-6666");
        user.setPassword("password");

        UserEntity createdUser = new UserEntity();
        createdUser.setId(1L);
        createdUser.setUserFirstName("Bob");
        createdUser.setUserLastName("Marley");
        createdUser.setEmail("bob@example.com");
        createdUser.setPhone("010-5555-6666");
        createdUser.setPassword("password");
        createdUser.setCreatedAt(LocalDateTime.now());

        when(userService.createUser(any(UserEntity.class))).thenReturn(createdUser);

        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users")
                        .with(csrf())  // POST 요청 시 CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userFirstName").value("Bob"));
    }

    // 사용자 정보 업데이트 (PUT /api/users/{id})
    @Test
    @WithMockUser
    public void testUpdateUser() throws Exception {
        UserEntity updateInfo = new UserEntity();
        updateInfo.setUserFirstName("Charlie");
        updateInfo.setUserLastName("Brown");
        updateInfo.setEmail("charlie@example.com");
        updateInfo.setPhone("010-7777-8888");
        updateInfo.setPassword("newpassword");

        UserEntity updatedUser = new UserEntity();
        updatedUser.setId(1L);
        updatedUser.setUserFirstName("Charlie");
        updatedUser.setUserLastName("Brown");
        updatedUser.setEmail("charlie@example.com");
        updatedUser.setPhone("010-7777-8888");
        updatedUser.setPassword("newpassword");
        updatedUser.setCreatedAt(LocalDateTime.now());

        when(userService.updateUser(eq(1L), any(UserEntity.class))).thenReturn(updatedUser);

        String updateJson = objectMapper.writeValueAsString(updateInfo);

        mockMvc.perform(put("/api/users/{id}", 1L)
                        .with(csrf())  // PUT 요청 시 CSRF 적용
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userFirstName").value("Charlie"))
                .andExpect(jsonPath("$.email").value("charlie@example.com"));
    }

    // 사용자 삭제 (DELETE /api/users/{id})
    @Test
    @WithMockUser
    public void testDeleteUser() throws Exception {
        when(userService.deleteUser(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/users/{id}", 1L)
                        .with(csrf()))  // DELETE 요청 시 CSRF 적용
                .andExpect(status().isOk());
    }
}
