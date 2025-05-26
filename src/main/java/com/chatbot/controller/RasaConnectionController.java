
package com.chatbot.controller;

import com.chatbot.service.RasaConnectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/rasa")
@Tag(name = "Rasa Connection", description = "Rasa server connection management APIs")
public class RasaConnectionController {
    
    @Autowired
    private RasaConnectionService rasaConnectionService;
    
    @GetMapping("/connection/status")
    @Operation(summary = "Check Rasa server connection status")
    public ResponseEntity<Map<String, Object>> checkConnection() {
        Map<String, Object> response = new HashMap<>();
        
        boolean isRunning = rasaConnectionService.isRasaServerRunning();
        response.put("connected", isRunning);
        response.put("status", isRunning ? "CONNECTED" : "DISCONNECTED");
        
        if (isRunning) {
            Map<String, Object> version = rasaConnectionService.getRasaVersion();
            response.put("version", version);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/train")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Trigger model training in Rasa")
    public ResponseEntity<Map<String, String>> trainModel() {
        Map<String, String> response = new HashMap<>();
        
        boolean success = rasaConnectionService.trainModel("./Chatbot_USTHB_Github");
        
        if (success) {
            response.put("status", "SUCCESS");
            response.put("message", "Entraînement du modèle démarré avec succès");
        } else {
            response.put("status", "ERROR");
            response.put("message", "Erreur lors du démarrage de l'entraînement");
        }
        
        return ResponseEntity.ok(response);
    }
}
