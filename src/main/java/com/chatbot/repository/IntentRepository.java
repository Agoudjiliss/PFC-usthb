package com.chatbot.repository;

import com.chatbot.model.Intent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IntentRepository extends JpaRepository<Intent, Long> {
    List<Intent> findByNameContainingIgnoreCaseOrExamplesContainingIgnoreCase(String name, String examples);
    List<Intent> findByIsActiveTrue();
    long countByIsActiveTrue();
}