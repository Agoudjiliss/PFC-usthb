package com.usthb.chatbot.integration;

import com.usthb.chatbot.dto.ChatMessage;
import com.usthb.chatbot.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class RasaClient {

    private final RestTemplate restTemplate;

    @Value("${rasa.url}")
    private String rasaUrl;

    @Value("${rasa.webhook}")
    private String webhookPath;

    public ChatResponse sendMessage(ChatMessage message) {
        String url = rasaUrl + webhookPath;
        return restTemplate.postForObject(url, message, ChatResponse.class);
    }

    public void trainModel() {
        String url = rasaUrl + "/model/train";
        restTemplate.postForObject(url, null, Void.class);
    }
} 