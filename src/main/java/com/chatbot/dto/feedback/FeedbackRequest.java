
package com.chatbot.dto.feedback;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class FeedbackRequest {
    
    @NotBlank(message = "Le message est requis")
    private String message;
    
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer rating;
    
    private String category;
    
    public FeedbackRequest() {}
    
    public FeedbackRequest(String message, Integer rating, String category) {
        this.message = message;
        this.rating = rating;
        this.category = category;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
}
