
package com.chatbot.repository;

import com.chatbot.model.TrainingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    
    Page<TrainingSession> findAllByOrderByStartedAtDesc(Pageable pageable);
    
    @Query("SELECT t FROM TrainingSession t WHERE t.status = 'RUNNING' ORDER BY t.startedAt DESC")
    Optional<TrainingSession> findRunningSession();
    
    @Query("SELECT t FROM TrainingSession t WHERE t.status = 'COMPLETED' ORDER BY t.completedAt DESC")
    Optional<TrainingSession> findLatestCompletedSession();
}
