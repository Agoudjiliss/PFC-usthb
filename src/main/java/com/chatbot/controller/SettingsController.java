
package com.chatbot.controller;

import com.chatbot.dto.settings.ChatSettingsRequest;
import com.chatbot.dto.settings.ChatSettingsResponse;
import com.chatbot.dto.settings.GeneralSettingsRequest;
import com.chatbot.dto.settings.GeneralSettingsResponse;
import com.chatbot.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "Chatbot settings management APIs")
public class SettingsController {
    
    @Autowired
    private SettingsService settingsService;
    
    @GetMapping("/chat")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get chat settings")
    public ResponseEntity<ChatSettingsResponse> getChatSettings() {
        ChatSettingsResponse settings = settingsService.getChatSettings();
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/chat")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update chat settings")
    public ResponseEntity<String> updateChatSettings(@Valid @RequestBody ChatSettingsRequest request) {
        settingsService.updateChatSettings(request);
        return ResponseEntity.ok("Paramètres de chat mis à jour");
    }
    
    @GetMapping("/general")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get general settings")
    public ResponseEntity<GeneralSettingsResponse> getGeneralSettings() {
        GeneralSettingsResponse settings = settingsService.getGeneralSettings();
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/general")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update general settings")
    public ResponseEntity<String> updateGeneralSettings(@Valid @RequestBody GeneralSettingsRequest request) {
        settingsService.updateGeneralSettings(request);
        return ResponseEntity.ok("Paramètres généraux mis à jour");
    }
}
