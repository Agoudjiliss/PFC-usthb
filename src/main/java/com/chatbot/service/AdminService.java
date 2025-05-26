
package com.chatbot.service;

import com.chatbot.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ChatMessageRepository messageRepository;
    
    @Autowired
    private IntentRepository intentRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private TrainingSessionRepository trainingRepository;
    
    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        stats.put("adminUsers", userRepository.countByRole("ADMIN"));
        stats.put("regularUsers", userRepository.countByRole("USER"));
        
        // Utilisateurs actifs (connectés dans les 7 derniers jours)
        LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        stats.put("activeUsers", userRepository.countByLastLoginAfter(weekAgo));
        
        return stats;
    }
    
    public Map<String, Object> getDeviceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Simuler des stats d'appareils (à adapter selon vos besoins)
        stats.put("mobileUsers", userRepository.count() * 0.7); // 70% mobile estimé
        stats.put("desktopUsers", userRepository.count() * 0.3); // 30% desktop estimé
        
        return stats;
    }
    
    public Map<String, Object> getLocationStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Simuler des stats géographiques (à adapter selon vos données)
        stats.put("Algeria", userRepository.count() * 0.9);
        stats.put("France", userRepository.count() * 0.05);
        stats.put("Others", userRepository.count() * 0.05);
        
        return stats;
    }
    
    public Map<String, Object> getFileStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalFiles", resourceRepository.count());
        stats.put("processedFiles", resourceRepository.countByStatus("COMPLETED"));
        stats.put("pendingFiles", resourceRepository.countByStatus("PENDING"));
        stats.put("errorFiles", resourceRepository.countByStatus("ERROR"));
        
        return stats;
    }
    
    public Map<String, Object> getIntentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalIntents", intentRepository.count());
        stats.put("activeIntents", intentRepository.countByIsActiveTrue());
        stats.put("totalMessages", messageRepository.count());
        stats.put("totalTrainingSessions", trainingRepository.count());
        
        return stats;
    }
}
