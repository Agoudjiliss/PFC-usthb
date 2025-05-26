
package com.chatbot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class ServiceConfig {

    @Bean
    @ConfigurationProperties(prefix = "services.rasa")
    public ServiceProperties rasaProperties() {
        return new ServiceProperties();
    }

    @Bean
    @ConfigurationProperties(prefix = "services.llm")
    public ServiceProperties llmProperties() {
        return new ServiceProperties();
    }

    @Bean("rasaWebClient")
    public WebClient rasaWebClient(ServiceProperties rasaProperties) {
        return WebClient.builder()
                .baseUrl(rasaProperties.getUrl())
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    @Bean("llmWebClient")
    public WebClient llmWebClient(ServiceProperties llmProperties) {
        return WebClient.builder()
                .baseUrl(llmProperties.getUrl())
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(50 * 1024 * 1024))
                .build();
    }

    public static class ServiceProperties {
        private String url;
        private long timeout = 30000;

        // Getters and setters
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        
        public long getTimeout() { return timeout; }
        public void setTimeout(long timeout) { this.timeout = timeout; }
    }
}
