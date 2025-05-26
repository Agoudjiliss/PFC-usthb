
package com.chatbot.controller;

import com.chatbot.dto.chat.ChatRequest;
import com.chatbot.dto.chat.ChatResponse;
import com.chatbot.model.ChatMessage;
import com.chatbot.model.User;
import com.chatbot.repository.ChatMessageRepository;
import com.chatbot.service.RasaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@Tag(name = "Chat", description = "Chat management APIs")
public class ChatController {
    
    @Autowired
    private RasaService rasaService;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @PostMapping
    @Operation(summary = "Send message to chatbot")
    public ResponseEntity<ChatResponse> sendMessage(@Valid @RequestBody ChatRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        // Send message to Rasa
        ChatResponse response = rasaService.sendMessage(request.getMessage(), user.getUsername());
        
        // Save conversation to database
        ChatMessage chatMessage = new ChatMessage(
                user,
                request.getMessage(),
                response.getResponse(),
                response.getIntent(),
                response.getConfidence()
        );
        
        chatMessage = chatMessageRepository.save(chatMessage);
        response.setMessageId(chatMessage.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get chat history")
    public ResponseEntity<Page<ChatMessage>> getChatHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ChatMessage> messages = chatMessageRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/intents")
    @Operation(summary = "Get intent suggestions")
    public ResponseEntity<Map<String, Object>> getIntentSuggestions() {
        List<Object[]> mostUsedIntents = chatMessageRepository.getMostUsedIntents();
        
        Map<String, Object> response = new HashMap<>();
        response.put("mostUsedIntents", mostUsedIntents);
        response.put("suggestions", List.of(
                "Comment créer une startup ?",
                "Quelles sont les étapes pour démarrer ?",
                "Où trouver des financements ?",
                "Comment valider mon idée ?"
        ));
        
        return ResponseEntity.ok(response);
    }
}
