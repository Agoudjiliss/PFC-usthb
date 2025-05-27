package com.usthb.chatbot.controller;

import com.usthb.chatbot.dto.AdminStats;
import com.usthb.chatbot.dto.Feedback;
import com.usthb.chatbot.dto.TrainingStatus;
import com.usthb.chatbot.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @PostMapping("/training/start")
    public ResponseEntity<Void> startTraining() {
        adminService.startTraining();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/training/stop")
    public ResponseEntity<Void> stopTraining() {
        adminService.stopTraining();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/training/status")
    public ResponseEntity<TrainingStatus> getTrainingStatus() {
        return ResponseEntity.ok(adminService.getTrainingStatus());
    }

    @PostMapping("/resources/upload")
    public ResponseEntity<String> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("filename") String filename) {
        String result = adminService.uploadResource(file, filename);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getFeedback(
            @RequestParam(defaultValue = "0") int start,
            @RequestParam(defaultValue = "10") int end) {
        List<Feedback> feedback = adminService.getFeedback(start, end);
        return ResponseEntity.ok(feedback);
    }
} 