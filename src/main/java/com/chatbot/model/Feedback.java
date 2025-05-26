
package com.chatbot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(length = 100)
    private String category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Feedback(String message, Integer rating, String category, User user) {
        this();
        this.message = message;
        this.rating = rating;
        this.category = category;
        this.user = user;
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
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
