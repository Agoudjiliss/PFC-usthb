
package com.chatbot.service;

import com.chatbot.config.ServiceConfig.ServiceProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Service
public class ExternalServiceClient {
    
    private static final Logger logger = LoggerFactory.getLogger(ExternalServiceClient.class);
    
    private final WebClient rasaWebClient;
    private final WebClient llmWebClient;
    private final ServiceProperties rasaProperties;
    private final ServiceProperties llmProperties;

    public ExternalServiceClient(
            @Qualifier("rasaWebClient") WebClient rasaWebClient,
            @Qualifier("llmWebClient") WebClient llmWebClient,
            ServiceProperties rasaProperties,
            ServiceProperties llmProperties) {
        this.rasaWebClient = rasaWebClient;
        this.llmWebClient = llmWebClient;
        this.rasaProperties = rasaProperties;
        this.llmProperties = llmProperties;
    }

    public Mono<String> callRasaWebhook(Map<String, Object> payload) {
        return rasaWebClient
                .post()
                .uri("/webhooks/rest/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(rasaProperties.getTimeout()))
                .doOnError(error -> logger.error("Rasa call failed: {}", error.getMessage()))
                .onErrorReturn("Service temporairement indisponible");
    }

    public Mono<String> callLlmService(String endpoint, Object payload) {
        return llmWebClient
                .post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMillis(llmProperties.getTimeout()))
                .doOnError(error -> logger.error("LLM service call failed: {}", error.getMessage()))
                .onErrorReturn("Erreur de traitement");
    }

    public Mono<Boolean> checkRasaHealth() {
        return rasaWebClient
                .get()
                .uri("/")
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> true)
                .onErrorReturn(false);
    }

    public Mono<Boolean> checkLlmHealth() {
        return llmWebClient
                .get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> true)
                .onErrorReturn(false);
    }
}
