package com.chatbot.repository;

import com.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = ?1")
    long countByRole(String role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin > ?1")
    long countByLastLoginAfter(LocalDateTime date);
}