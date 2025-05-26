
package com.chatbot.service;

import com.chatbot.model.RasaModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class RasaConnectionService {
    
    private static final Logger logger = LoggerFactory.getLogger(RasaConnectionService.class);
    
    @Value("${rasa.url}")
    private String rasaUrl;
    
    @Value("${app.upload.dir:uploads/rasa-models}")
    private String uploadDir;
    
    private final WebClient webClient;
    
    public RasaConnectionService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
    }
    
    public boolean isRasaServerRunning() {
        try {
            String response = webClient
                    .get()
                    .uri(rasaUrl + "/status")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            
            logger.info("Rasa server status: {}", response);
            return response != null;
            
        } catch (Exception e) {
            logger.warn("Rasa server is not available: {}", e.getMessage());
            return false;
        }
    }
    
    public boolean loadModel(RasaModel model) {
        try {
            // Check if model file exists
            Path modelPath = Paths.get(model.getFilePath());
            if (!Files.exists(modelPath)) {
                logger.error("Model file not found: {}", model.getFilePath());
                return false;
            }
            
            // Load model in Rasa
            Map<String, Object> request = new HashMap<>();
            request.put("model_file", model.getFilePath());
            
            String response = webClient
                    .put()
                    .uri(rasaUrl + "/model")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
            
            logger.info("Model loaded in Rasa: {}", response);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to load model in Rasa: {}", e.getMessage());
            return false;
        }
    }
    
    public Map<String, Object> getRasaVersion() {
        try {
            Map<String, Object> response = webClient
                    .get()
                    .uri(rasaUrl + "/version")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to get Rasa version: {}", e.getMessage());
            return new HashMap<>();
        }
    }
    
    public boolean trainModel(String projectPath) {
        try {
            // This would trigger training in your Rasa instance
            // For now, we'll just check if the training endpoint is available
            Map<String, Object> request = new HashMap<>();
            request.put("save_to_default_model_directory", true);
            
            String response = webClient
                    .post()
                    .uri(rasaUrl + "/model/train")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMinutes(5))
                    .block();
            
            logger.info("Training response: {}", response);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to train model: {}", e.getMessage());
            return false;
        }
    }
}
