
package com.chatbot.repository;

import com.chatbot.model.Feedback;
import com.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByUserOrderByCreatedAtDesc(User user);
    
    List<Feedback> findByCategoryOrderByCreatedAtDesc(String category);
    
    @Query("SELECT f FROM Feedback f ORDER BY f.createdAt DESC")
    List<Feedback> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating >= ?1")
    Long countByRatingGreaterThanEqual(Integer rating);
}
