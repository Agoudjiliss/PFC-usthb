
package com.chatbot.controller;

import com.chatbot.dto.rasa.RasaModelResponse;
import com.chatbot.model.User;
import com.chatbot.service.RasaModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rasa")
@Tag(name = "Rasa Models", description = "Rasa model management APIs")
public class RasaModelController {
    
    @Autowired
    private RasaModelService rasaModelService;
    
    @PostMapping("/models/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload a new Rasa model")
    public ResponseEntity<RasaModelResponse> uploadModel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("modelName") String modelName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "version", required = false) String version,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        
        RasaModelResponse response = rasaModelService.uploadModel(
            file, modelName, description, version, user
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/models")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all Rasa models")
    public ResponseEntity<List<RasaModelResponse>> getAllModels() {
        List<RasaModelResponse> models = rasaModelService.getAllModels();
        return ResponseEntity.ok(models);
    }
    
    @GetMapping("/models/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Rasa model by ID")
    public ResponseEntity<RasaModelResponse> getModelById(@PathVariable Long id) {
        return rasaModelService.getModelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/models/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate a Rasa model")
    public ResponseEntity<RasaModelResponse> activateModel(@PathVariable Long id) {
        RasaModelResponse response = rasaModelService.activateModel(id);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/models/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a Rasa model")
    public ResponseEntity<Map<String, String>> deleteModel(@PathVariable Long id) {
        rasaModelService.deleteModel(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Modèle supprimé avec succès");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/models/active")
    @Operation(summary = "Get currently active Rasa model")
    public ResponseEntity<RasaModelResponse> getActiveModel() {
        return rasaModelService.getActiveModel()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status")
    @Operation(summary = "Check Rasa connection status")
    public ResponseEntity<Map<String, Object>> getRasaStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if there's an active model
            var activeModel = rasaModelService.getActiveModel();
            
            response.put("connected", true);
            response.put("hasActiveModel", activeModel.isPresent());
            
            if (activeModel.isPresent()) {
                response.put("activeModel", activeModel.get());
            }
            
        } catch (Exception e) {
            response.put("connected", false);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
