
package com.chatbot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
public class Settings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "setting_key", unique = true, nullable = false)
    private String key;
    
    @Column(name = "setting_value", length = 1000)
    private String value;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Settings() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public Settings(String key, String value) {
        this();
        this.key = key;
        this.value = value;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
