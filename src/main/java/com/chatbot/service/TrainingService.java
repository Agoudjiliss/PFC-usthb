
package com.chatbot.service;

import com.chatbot.model.TrainingSession;
import com.chatbot.model.User;
import com.chatbot.repository.TrainingSessionRepository;
import com.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class TrainingService {
    
    @Autowired
    private TrainingSessionRepository trainingSessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RasaService rasaService;
    
    public TrainingSession startTraining(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        TrainingSession session = new TrainingSession(user);
        session.setStatus(TrainingSession.TrainingStatus.RUNNING);
        session = trainingSessionRepository.save(session);
        
        // Lancer l'entraînement de manière asynchrone
        Long sessionId = session.getId();
        CompletableFuture.runAsync(() -> executeTraining(sessionId));
        
        return session;
    }
    
    public TrainingSession startAutomaticTraining(User user, String description) {
        TrainingSession session = new TrainingSession(user);
        session.setStatus(TrainingSession.TrainingStatus.RUNNING);
        session.setLogs("Entraînement automatique démarré: " + description);
        session = trainingSessionRepository.save(session);
        
        Long sessionId = session.getId();
        CompletableFuture.runAsync(() -> executeTraining(sessionId));
        
        return session;
    }
    
    private void executeTraining(Long sessionId) {
        Optional<TrainingSession> optionalSession = trainingSessionRepository.findById(sessionId);
        if (optionalSession.isEmpty()) {
            return;
        }
        
        TrainingSession session = optionalSession.get();
        
        try {
            // Ajouter des logs
            session.setLogs(session.getLogs() + "\n[" + LocalDateTime.now() + "] Démarrage de l'entraînement Rasa...");
            trainingSessionRepository.save(session);
            
            // Appeler Rasa pour l'entraînement
            String result = rasaService.trainModel();
            
            // Mettre à jour la session
            session.setStatus(TrainingSession.TrainingStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
            session.setLogs(session.getLogs() + "\n[" + LocalDateTime.now() + "] Entraînement terminé avec succès");
            session.setModelPath(result);
            
        } catch (Exception e) {
            session.setStatus(TrainingSession.TrainingStatus.FAILED);
            session.setCompletedAt(LocalDateTime.now());
            session.setErrorMessage(e.getMessage());
            session.setLogs(session.getLogs() + "\n[" + LocalDateTime.now() + "] Erreur: " + e.getMessage());
        }
        
        trainingSessionRepository.save(session);
    }
    
    public List<TrainingSession> getTrainingHistory() {
        return trainingSessionRepository.findAllByOrderByStartedAtDesc();
    }
    
    public Optional<TrainingSession> getCurrentTraining() {
        return trainingSessionRepository.findFirstByStatusOrderByStartedAtDesc(TrainingSession.TrainingStatus.RUNNING);
    }
    
    public Optional<TrainingSession> getTrainingById(Long id) {
        return trainingSessionRepository.findById(id);
    }
}
