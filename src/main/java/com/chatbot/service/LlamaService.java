
package com.chatbot.service;

import com.chatbot.model.Resource;
import com.chatbot.repository.ResourceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LlamaService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private RasaService rasaService;
    
    @Autowired
    private TrainingService trainingService;
    
    @Value("${llama.server.url:http://localhost:8080}")
    private String llamaServerUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String processResource(Long resourceId) throws Exception {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource non trouvée"));
        
        // Mettre à jour le statut
        resource.setStatus(Resource.ProcessingStatus.PROCESSING);
        resourceRepository.save(resource);
        
        try {
            // 1. Envoyer le PDF à LLaMA
            String extractedText = sendPdfToLlama(resource.getFilePath());
            
            // 2. Demander à LLaMA de générer un dataset JSON pour Rasa
            String rasaDataset = generateRasaDataset(extractedText);
            
            // 3. Sauvegarder le dataset généré
            String datasetPath = saveDatasetToFile(rasaDataset, resource.getId());
            
            // 4. Intégrer automatiquement dans Rasa
            rasaService.updateTrainingData(rasaDataset);
            
            // 5. Lancer l'entraînement automatique
            trainingService.startAutomaticTraining(resource.getUploadedBy(), "Auto-training from resource: " + resource.getFileName());
            
            // Mettre à jour le statut
            resource.setStatus(Resource.ProcessingStatus.COMPLETED);
            resource.setProcessedDataPath(datasetPath);
            resourceRepository.save(resource);
            
            return "Traitement terminé avec succès. Entraînement Rasa lancé automatiquement.";
            
        } catch (Exception e) {
            resource.setStatus(Resource.ProcessingStatus.ERROR);
            resource.setErrorMessage(e.getMessage());
            resourceRepository.save(resource);
            throw e;
        }
    }
    
    private String sendPdfToLlama(String filePath) throws Exception {
        String url = llamaServerUrl + "/process-pdf";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(new File(filePath)));
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Erreur lors de l'extraction du texte avec LLaMA: " + response.getStatusCode());
        }
    }
    
    private String generateRasaDataset(String extractedText) throws Exception {
        String url = llamaServerUrl + "/generate-rasa-dataset";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", extractedText);
        requestBody.put("context", "USTHB Bot - Assistant pour étudiants en innovation et entrepreneuriat");
        
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Erreur lors de la génération du dataset Rasa: " + response.getStatusCode());
        }
    }
    
    private String saveDatasetToFile(String rasaDataset, Long resourceId) throws IOException {
        String fileName = "rasa_dataset_" + resourceId + "_" + System.currentTimeMillis() + ".json";
        String filePath = "uploads/datasets/" + fileName;
        
        // Créer le répertoire s'il n'existe pas
        File directory = new File("uploads/datasets");
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Écrire le dataset dans le fichier
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(rasaDataset);
        }
        
        return filePath;
    }
    
    public boolean isLlamaServerAvailable() {
        try {
            String url = llamaServerUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}
