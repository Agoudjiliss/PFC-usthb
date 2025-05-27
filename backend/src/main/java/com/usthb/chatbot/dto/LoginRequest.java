package com.usthb.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String username;
    private String email;
    private String password;

    public String getIdentifier() {
        return (username != null && !username.isEmpty()) ? username : email;
    }
} 