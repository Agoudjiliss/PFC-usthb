
package com.chatbot.controller;

import com.chatbot.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/stats/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        return ResponseEntity.ok(adminService.getUserStats());
    }
    
    @GetMapping("/stats/devices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDeviceStats() {
        return ResponseEntity.ok(adminService.getDeviceStats());
    }
    
    @GetMapping("/stats/locations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLocationStats() {
        return ResponseEntity.ok(adminService.getLocationStats());
    }
    
    @GetMapping("/stats/files")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getFileStats() {
        return ResponseEntity.ok(adminService.getFileStats());
    }
    
    @GetMapping("/stats/intents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getIntentStats() {
        return ResponseEntity.ok(adminService.getIntentStats());
    }
}
