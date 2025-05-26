
package com.chatbot.dto.feedback;

import java.time.LocalDateTime;

public class FeedbackResponse {
    
    private Long id;
    private String message;
    private Integer rating;
    private String category;
    private String username;
    private LocalDateTime createdAt;
    
    public FeedbackResponse() {}
    
    public FeedbackResponse(Long id, String message, Integer rating, String category, 
                           String username, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.rating = rating;
        this.category = category;
        this.username = username;
        this.createdAt = createdAt;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
