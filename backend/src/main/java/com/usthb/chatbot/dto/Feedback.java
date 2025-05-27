package com.usthb.chatbot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Feedback {
    private Long id;
    private String userId;
    private String message;
    private int rating;
    private String category;
    private LocalDateTime timestamp;
    private boolean resolved;
} 