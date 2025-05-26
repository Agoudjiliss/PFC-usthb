
package com.chatbot.service;

import com.chatbot.dto.rasa.RasaModelResponse;
import com.chatbot.model.RasaModel;
import com.chatbot.model.User;
import com.chatbot.repository.RasaModelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RasaModelService {
    
    private static final Logger logger = LoggerFactory.getLogger(RasaModelService.class);
    
    @Autowired
    private RasaModelRepository rasaModelRepository;
    
    @Autowired
    private RasaService rasaService;
    
    @Autowired
    private RasaConnectionService rasaConnectionService;
    
    @Value("${app.upload.dir:uploads/rasa-models}")
    private String uploadDir;
    
    public RasaModelResponse uploadModel(MultipartFile file, String modelName, 
                                       String description, String version, User user) {
        try {
            // Validate file
            validateModelFile(file);
            
            // Check if model name already exists
            if (rasaModelRepository.existsByModelName(modelName)) {
                throw new RuntimeException("Un modèle avec ce nom existe déjà");
            }
            
            // Create upload directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create RasaModel entity
            RasaModel rasaModel = new RasaModel(
                modelName, description, version, 
                filePath.toString(), originalFilename, user
            );
            
            rasaModel = rasaModelRepository.save(rasaModel);
            
            logger.info("Modèle Rasa uploadé avec succès: {}", modelName);
            
            return convertToResponse(rasaModel);
            
        } catch (IOException e) {
            logger.error("Erreur lors de l'upload du modèle: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'upload du fichier");
        }
    }
    
    public List<RasaModelResponse> getAllModels() {
        return rasaModelRepository.findAllOrderByUploadedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<RasaModelResponse> getModelById(Long id) {
        return rasaModelRepository.findById(id)
                .map(this::convertToResponse);
    }
    
    public RasaModelResponse activateModel(Long id) {
        RasaModel model = rasaModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modèle non trouvé"));
        
        // Deactivate current active model
        Optional<RasaModel> currentActive = rasaModelRepository.findByIsActiveTrue();
        if (currentActive.isPresent()) {
            RasaModel activeModel = currentActive.get();
            activeModel.setActive(false);
            rasaModelRepository.save(activeModel);
        }
        
        // Activate new model
        model.setActive(true);
        model.setActivatedAt(LocalDateTime.now());
        model.setStatus(RasaModel.ModelStatus.DEPLOYED);
        
        // Here you would typically deploy the model to Rasa
        boolean deploymentSuccess = deployModelToRasa(model);
        
        if (!deploymentSuccess) {
            model.setStatus(RasaModel.ModelStatus.ERROR);
            throw new RuntimeException("Erreur lors du déploiement du modèle vers Rasa");
        }
        
        model = rasaModelRepository.save(model);
        
        logger.info("Modèle activé avec succès: {}", model.getModelName());
        
        return convertToResponse(model);
    }
    
    public void deleteModel(Long id) {
        RasaModel model = rasaModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modèle non trouvé"));
        
        if (model.isActive()) {
            throw new RuntimeException("Impossible de supprimer le modèle actif");
        }
        
        // Delete file
        try {
            Files.deleteIfExists(Paths.get(model.getFilePath()));
        } catch (IOException e) {
            logger.warn("Impossible de supprimer le fichier: {}", e.getMessage());
        }
        
        rasaModelRepository.delete(model);
        
        logger.info("Modèle supprimé: {}", model.getModelName());
    }
    
    public Optional<RasaModelResponse> getActiveModel() {
        return rasaModelRepository.findByIsActiveTrue()
                .map(this::convertToResponse);
    }
    
    private void validateModelFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Le fichier est vide");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.endsWith(".tar.gz") && !filename.endsWith(".zip"))) {
            throw new RuntimeException("Format de fichier non supporté. Utilisez .tar.gz ou .zip");
        }
        
        // Check file size (max 100MB)
        if (file.getSize() > 100 * 1024 * 1024) {
            throw new RuntimeException("Le fichier est trop volumineux (max 100MB)");
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) return "";
        return filename.substring(lastDotIndex);
    }
    
    private boolean deployModelToRasa(RasaModel model) {
        try {
            // Check if Rasa server is running
            if (!rasaConnectionService.isRasaServerRunning()) {
                logger.error("Rasa server is not running");
                return false;
            }
            
            // Load the model in Rasa
            return rasaConnectionService.loadModel(model);
            
        } catch (Exception e) {
            logger.error("Erreur lors du déploiement vers Rasa: {}", e.getMessage());
            return false;
        }
    }
    
    private RasaModelResponse convertToResponse(RasaModel model) {
        return new RasaModelResponse(
            model.getId(),
            model.getModelName(),
            model.getDescription(),
            model.getVersion(),
            model.getStatus().toString(),
            model.getFilePath(),
            model.getUploadedAt(),
            model.isActive()
        );
    }
}
