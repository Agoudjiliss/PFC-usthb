package com.usthb.chatbot.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatResponse {
    private String message;
    private List<String> suggestions;
    private String intent;
    private double confidence;
    private String sessionId;
    private boolean success;
    private String errorMessage;
} 