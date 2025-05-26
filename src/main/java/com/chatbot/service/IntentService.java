
package com.chatbot.service;

import com.chatbot.model.Intent;
import com.chatbot.repository.IntentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IntentService {
    
    @Autowired
    private IntentRepository intentRepository;
    
    public Page<Intent> findAll(Pageable pageable) {
        return intentRepository.findAll(pageable);
    }
    
    public Optional<Intent> findById(Long id) {
        return intentRepository.findById(id);
    }
    
    public Intent save(Intent intent) {
        if (intent.getId() == null) {
            intent.setCreatedAt(LocalDateTime.now());
        }
        intent.setUpdatedAt(LocalDateTime.now());
        return intentRepository.save(intent);
    }
    
    public void deleteById(Long id) {
        intentRepository.deleteById(id);
    }
    
    public List<Intent> searchByNameOrExamples(String query) {
        return intentRepository.findByNameContainingIgnoreCaseOrExamplesContainingIgnoreCase(query, query);
    }
    
    public List<Intent> findActiveIntents() {
        return intentRepository.findByIsActiveTrue();
    }
}
