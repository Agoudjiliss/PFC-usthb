package com.usthb.chatbot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long id;
    private String sender;
    private String message;
    private LocalDateTime timestamp;
    private String sessionId;
    private MessageType type;
    
    public enum MessageType {
        USER,
        BOT
    }
} 