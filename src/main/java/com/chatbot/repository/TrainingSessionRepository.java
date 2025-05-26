package com.chatbot.repository;

import com.chatbot.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findAllByOrderByStartedAtDesc();
    Optional<TrainingSession> findFirstByStatusOrderByStartedAtDesc(TrainingSession.TrainingStatus status);
}
`