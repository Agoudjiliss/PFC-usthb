
package com.chatbot.controller;

import com.chatbot.model.TrainingSession;
import com.chatbot.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TrainingController {
    
    @Autowired
    private TrainingService trainingService;
    
    @PostMapping("/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingSession> startTraining(Authentication authentication) {
        TrainingSession session = trainingService.startTraining(authentication.getName());
        return ResponseEntity.ok(session);
    }
    
    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingSession> getCurrentTrainingStatus() {
        return trainingService.getCurrentTraining()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainingSession>> getTrainingHistory() {
        return ResponseEntity.ok(trainingService.getTrainingHistory());
    }
    
    @GetMapping("/logs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getTrainingLogs(@PathVariable Long id) {
        return trainingService.getTrainingById(id)
                .map(session -> ResponseEntity.ok(session.getLogs()))
                .orElse(ResponseEntity.notFound().build());
    }
}
