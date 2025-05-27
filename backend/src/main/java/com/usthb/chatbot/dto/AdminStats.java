package com.usthb.chatbot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminStats {
    private int totalUsers;
    private int activeUsers;
    private int totalMessages;
    private int successfulResponses;
    private int failedResponses;
    private double averageResponseTime;
    private LocalDateTime lastUpdate;
    private TrainingStatus trainingStatus;
} 