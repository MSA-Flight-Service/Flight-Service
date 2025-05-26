package com.example.demo.userservice.repository;

import com.example.demo.userservice.entity.UserEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByPhone(String phone);
    boolean existsByEmail(String mail);

    @Query(value = "SELECT * FROM users", nativeQuery = true)
    List<UserEntity> findUserByIdIncludeDeleted();

    @Modifying
    @Transactional
    @Query("DELETE FROM UserEntity u WHERE u.deletedAt IS NOT NULL AND u.deletedAt < :cutoffDate")
    int hardDeleteByDeletedBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
}
