
package com.chatbot.controller;

import com.chatbot.model.Intent;
import com.chatbot.service.IntentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IntentController {
    
    @Autowired
    private IntentService intentService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Intent>> getAllIntents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(intentService.findAll(PageRequest.of(page, size)));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Intent> getIntentById(@PathVariable Long id) {
        return intentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Intent> createIntent(@RequestBody Intent intent) {
        return ResponseEntity.ok(intentService.save(intent));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Intent> updateIntent(@PathVariable Long id, @RequestBody Intent intent) {
        return intentService.findById(id)
                .map(existingIntent -> {
                    intent.setId(id);
                    return ResponseEntity.ok(intentService.save(intent));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteIntent(@PathVariable Long id) {
        return intentService.findById(id)
                .map(intent -> {
                    intentService.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Intent>> searchIntents(@RequestParam String query) {
        return ResponseEntity.ok(intentService.searchByNameOrExamples(query));
    }
}
