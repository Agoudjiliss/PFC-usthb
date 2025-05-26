
package com.chatbot.service;

import com.chatbot.model.Resource;
import com.chatbot.model.User;
import com.chatbot.repository.ResourceRepository;
import com.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final String uploadDir = "uploads/";
    
    public Resource uploadFile(MultipartFile file, String description, String username) throws IOException {
        // Créer le répertoire s'il n'existe pas
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Générer un nom de fichier unique
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        String filePath = uploadDir + uniqueFileName;
        
        // Sauvegarder le fichier
        Path path = Paths.get(filePath);
        Files.write(path, file.getBytes());
        
        // Récupérer l'utilisateur
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Créer l'entité Resource
        Resource resource = new Resource();
        resource.setFilename(originalFileName);
        resource.setFilePath(filePath);
        resource.setContentType(file.getContentType());
        resource.setFileSize(file.getSize());
        // Note: description field doesn't exist in Resource model
        resource.setUploadedBy(user);
        resource.setUploadedAt(LocalDateTime.now());
        resource.setStatus(Resource.ProcessingStatus.PENDING);
        
        return resourceRepository.save(resource);
    }
    
    public Page<Resource> findAll(Pageable pageable) {
        return resourceRepository.findAll(pageable);
    }
    
    public Optional<Resource> findById(Long id) {
        return resourceRepository.findById(id);
    }
    
    public void deleteById(Long id) {
        Optional<Resource> resource = resourceRepository.findById(id);
        if (resource.isPresent()) {
            // Supprimer le fichier physique
            try {
                Files.deleteIfExists(Paths.get(resource.get().getFilePath()));
            } catch (IOException e) {
                // Log l'erreur mais continue la suppression en base
            }
            resourceRepository.deleteById(id);
        }
    }
}
