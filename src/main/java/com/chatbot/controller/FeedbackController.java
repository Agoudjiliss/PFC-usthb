
package com.chatbot.controller;

import com.chatbot.dto.feedback.FeedbackRequest;
import com.chatbot.dto.feedback.FeedbackResponse;
import com.chatbot.model.User;
import com.chatbot.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Feedback", description = "User feedback management APIs")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping
    @Operation(summary = "Submit user feedback")
    public ResponseEntity<String> submitFeedback(
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        feedbackService.saveFeedback(request, user);
        
        return ResponseEntity.ok("Feedback soumis avec succès");
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all feedback (admin only)")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        List<FeedbackResponse> feedbacks = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get feedback by ID")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
