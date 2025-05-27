package com.usthb.chatbot.service;

import com.usthb.chatbot.dto.ChatMessage;
import com.usthb.chatbot.dto.ChatResponse;
import com.usthb.chatbot.integration.RasaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RasaClient rasaClient;
    private final Map<String, List<ChatMessage>> chatHistory = new ConcurrentHashMap<>();

    public ChatResponse processMessage(ChatMessage message) {
        // Envoyer le message à Rasa
        ChatResponse rasaResponse = rasaClient.sendMessage(message);
        
        // Sauvegarder dans l'historique
        chatHistory.computeIfAbsent(message.getSessionId(), k -> new ArrayList<>())
                .add(message);
        
        return rasaResponse;
    }

    public List<ChatMessage> getChatHistory(String sessionId, int limit) {
        List<ChatMessage> history = chatHistory.getOrDefault(sessionId, new ArrayList<>());
        int startIndex = Math.max(0, history.size() - limit);
        return history.subList(startIndex, history.size());
    }

    public void clearChatHistory(String sessionId) {
        chatHistory.remove(sessionId);
    }
} 