package com.chatbot.service;

import com.chatbot.dto.chat.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RasaService {

    private static final Logger logger = LoggerFactory.getLogger(RasaService.class);

    @Value("${rasa.url}")
    private String rasaUrl;

    private final WebClient webClient;

    public RasaService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    public ChatResponse sendMessage(String message, String sender) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("sender", sender);
            request.put("message", message);

            List<Map<String, Object>> response = webClient
                    .post()
                    .uri(rasaUrl + "/webhooks/rest/webhook")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            if (response != null && !response.isEmpty()) {
                Map<String, Object> botResponse = response.get(0);
                String text = (String) botResponse.get("text");

                // Parse intent and confidence from Rasa response
                String intent = parseIntent(message, sender);
                Double confidence = parseConfidence(message, sender);

                return new ChatResponse(text, intent, confidence, null);
            }

            return new ChatResponse("Je n'ai pas compris votre message. Pouvez-vous reformuler ?", "fallback", 0.0, null);

        } catch (WebClientResponseException e) {
            logger.error("Error calling Rasa API: {}", e.getMessage());
            return new ChatResponse("Désolé, le service de chat est temporairement indisponible.", "error", 0.0, null);
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage());
            return new ChatResponse("Une erreur inattendue s'est produite.", "error", 0.0, null);
        }
    }

    private String parseIntent(String message, String sender) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("text", message);

            Map<String, Object> response = webClient
                    .post()
                    .uri(rasaUrl + "/model/parse")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("intent")) {
                Map<String, Object> intentData = (Map<String, Object>) response.get("intent");
                return (String) intentData.get("name");
            }
        } catch (Exception e) {
            logger.warn("Could not parse intent: {}", e.getMessage());
        }
        return "unknown";
    }

    private Double parseConfidence(String message, String sender) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("text", message);

            Map<String, Object> response = webClient
                    .post()
                    .uri(rasaUrl + "/model/parse")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null && response.containsKey("intent")) {
                Map<String, Object> intentData = (Map<String, Object>) response.get("intent");
                return (Double) intentData.get("confidence");
            }
        } catch (Exception e) {
            logger.warn("Could not parse confidence: {}", e.getMessage());
        }
        return 0.0;
    }

    public boolean isRasaAvailable() {
        try {
            String response = webClient
                    .get()
                    .uri(rasaUrl + "/status")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return response != null;
        } catch (Exception e) {
            logger.warn("Rasa is not available: {}", e.getMessage());
            return false;
        }
    }

    public String sendMessage(String message) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", "user");
            payload.put("message", message);

           /* HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                rasaUrl + "/webhooks/rest/webhook", 
                HttpMethod.POST, 
                request, 
                String.class
            );

            return response.getBody();*/
            return "Implement the logic using WebClient"; // Placeholder, replace with actual logic
        } catch (Exception e) {
            return "Erreur de communication avec Rasa: " + e.getMessage();
        }
    }

    public void updateTrainingData(String rasaDataset) {
        try {
            /*HttpEntity<String> request = new HttpEntity<>(rasaDataset, headers);

            restTemplate.exchange(
                rasaUrl + "/model/train", 
                HttpMethod.POST, 
                request, 
                String.class
            );*/
             // Placeholder, replace with actual logic
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la mise à jour des données d'entraînement: " + e.getMessage());
        }
    }

    public String trainModel() {
        try {
           /* HttpEntity<String> request = new HttpEntity<>("{}", headers);

            ResponseEntity<String> response = restTemplate.exchange(
                rasaUrl + "/model/train", 
                HttpMethod.POST, 
                request, 
                String.class
            );

            return response.getBody();*/
             return "Implement the logic using WebClient"; // Placeholder, replace with actual logic
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'entraînement du modèle: " + e.getMessage());
        }
    }

   /* public boolean isRasaAvailable() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(rasaUrl + "/status", String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }*/
}