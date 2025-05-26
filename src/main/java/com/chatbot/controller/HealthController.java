
package com.chatbot.controller;

import com.chatbot.service.LlamaService;
import com.chatbot.service.RasaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {
    
    @Autowired
    private RasaService rasaService;
    
    @Autowired
    private LlamaService llamaService;
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        health.put("backend", "UP");
        health.put("rasa", rasaService.isRasaAvailable() ? "UP" : "DOWN");
        health.put("llama", llamaService.isLlamaServerAvailable() ? "UP" : "DOWN");
        health.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(health);
    }
}
