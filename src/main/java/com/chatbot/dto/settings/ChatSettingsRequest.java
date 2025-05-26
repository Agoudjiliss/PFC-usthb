
package com.chatbot.dto.settings;

import jakarta.validation.constraints.NotBlank;

public class ChatSettingsRequest {
    
    @NotBlank(message = "Le message d'accueil est requis")
    private String welcomeMessage;
    
    @NotBlank(message = "Le message de fallback est requis")
    private String fallbackMessage;
    
    private String helpMessage;
    private Boolean enableWelcomeMessage;
    
    public ChatSettingsRequest() {}
    
    public ChatSettingsRequest(String welcomeMessage, String fallbackMessage, 
                              String helpMessage, Boolean enableWelcomeMessage) {
        this.welcomeMessage = welcomeMessage;
        this.fallbackMessage = fallbackMessage;
        this.helpMessage = helpMessage;
        this.enableWelcomeMessage = enableWelcomeMessage;
    }
    
    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }
    
    public String getFallbackMessage() { return fallbackMessage; }
    public void setFallbackMessage(String fallbackMessage) { this.fallbackMessage = fallbackMessage; }
    
    public String getHelpMessage() { return helpMessage; }
    public void setHelpMessage(String helpMessage) { this.helpMessage = helpMessage; }
    
    public Boolean getEnableWelcomeMessage() { return enableWelcomeMessage; }
    public void setEnableWelcomeMessage(Boolean enableWelcomeMessage) { this.enableWelcomeMessage = enableWelcomeMessage; }
}
