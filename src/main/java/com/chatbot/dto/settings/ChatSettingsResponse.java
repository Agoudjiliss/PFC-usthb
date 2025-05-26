
package com.chatbot.dto.settings;

public class ChatSettingsResponse {
    
    private String welcomeMessage;
    private String fallbackMessage;
    private String helpMessage;
    private Boolean enableWelcomeMessage;
    
    public ChatSettingsResponse() {}
    
    public ChatSettingsResponse(String welcomeMessage, String fallbackMessage, 
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
