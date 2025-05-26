
package com.chatbot.repository;

import com.chatbot.model.ChatMessage;
import com.chatbot.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<ChatMessage> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.createdAt >= :date")
    long countMessagesAfter(LocalDateTime date);
    
    @Query("SELECT cm.intent, COUNT(cm) FROM ChatMessage cm WHERE cm.intent IS NOT NULL GROUP BY cm.intent ORDER BY COUNT(cm) DESC")
    List<Object[]> getMostUsedIntents();
}
