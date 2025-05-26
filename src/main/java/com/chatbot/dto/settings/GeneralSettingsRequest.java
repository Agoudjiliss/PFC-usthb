
package com.chatbot.dto.settings;

import jakarta.validation.constraints.Min;

public class GeneralSettingsRequest {
    
    private Boolean botEnabled;
    
    @Min(value = 100, message = "La fréquence doit être d'au moins 100ms")
    private Integer responseFrequency;
    
    private Boolean enableLogging;
    private Boolean enableAnalytics;
    
    public GeneralSettingsRequest() {}
    
    public GeneralSettingsRequest(Boolean botEnabled, Integer responseFrequency, 
                                 Boolean enableLogging, Boolean enableAnalytics) {
        this.botEnabled = botEnabled;
        this.responseFrequency = responseFrequency;
        this.enableLogging = enableLogging;
        this.enableAnalytics = enableAnalytics;
    }
    
    public Boolean getBotEnabled() { return botEnabled; }
    public void setBotEnabled(Boolean botEnabled) { this.botEnabled = botEnabled; }
    
    public Integer getResponseFrequency() { return responseFrequency; }
    public void setResponseFrequency(Integer responseFrequency) { this.responseFrequency = responseFrequency; }
    
    public Boolean getEnableLogging() { return enableLogging; }
    public void setEnableLogging(Boolean enableLogging) { this.enableLogging = enableLogging; }
    
    public Boolean getEnableAnalytics() { return enableAnalytics; }
    public void setEnableAnalytics(Boolean enableAnalytics) { this.enableAnalytics = enableAnalytics; }
}
