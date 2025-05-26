
package com.chatbot.service;

import com.chatbot.dto.feedback.FeedbackRequest;
import com.chatbot.dto.feedback.FeedbackResponse;
import com.chatbot.model.Feedback;
import com.chatbot.model.User;
import com.chatbot.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    public void saveFeedback(FeedbackRequest request, User user) {
        Feedback feedback = new Feedback(
            request.getMessage(),
            request.getRating(),
            request.getCategory(),
            user
        );
        
        feedbackRepository.save(feedback);
    }
    
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<FeedbackResponse> getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .map(this::convertToResponse);
    }
    
    public List<FeedbackResponse> getFeedbackByUser(User user) {
        return feedbackRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Double getAverageRating() {
        return feedbackRepository.getAverageRating();
    }
    
    private FeedbackResponse convertToResponse(Feedback feedback) {
        return new FeedbackResponse(
            feedback.getId(),
            feedback.getMessage(),
            feedback.getRating(),
            feedback.getCategory(),
            feedback.getUser().getUsername(),
            feedback.getCreatedAt()
        );
    }
}
