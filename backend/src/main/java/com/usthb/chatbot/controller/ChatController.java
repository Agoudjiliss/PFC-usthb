package com.usthb.chatbot.controller;

import com.usthb.chatbot.dto.ChatMessage;
import com.usthb.chatbot.dto.ChatResponse;
import com.usthb.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatService.processMessage(message));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(chatService.getChatHistory(sessionId, limit));
    }

    @DeleteMapping("/history/{sessionId}")
    public ResponseEntity<Void> clearChatHistory(@PathVariable String sessionId) {
        chatService.clearChatHistory(sessionId);
        return ResponseEntity.ok().build();
    }
} 