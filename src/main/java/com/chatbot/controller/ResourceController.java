
package com.chatbot.controller;

import com.chatbot.dto.resource.ResourceResponse;
import com.chatbot.model.Resource;
import com.chatbot.service.ResourceService;
import com.chatbot.service.LlamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    @Autowired
    private LlamaService llamaService;
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            Authentication authentication) {
        try {
            Resource resource = resourceService.uploadFile(file, description, authentication.getName());
            return ResponseEntity.ok(new ResourceResponse(resource));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Resource>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(resourceService.findAll(PageRequest.of(page, size)));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return resourceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        return resourceService.findById(id)
                .map(resource -> {
                    resourceService.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/process/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> processWithLlama(@PathVariable Long id) {
        try {
            String result = llamaService.processResource(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors du traitement: " + e.getMessage());
        }
    }
}
