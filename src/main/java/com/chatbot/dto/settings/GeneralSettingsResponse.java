
package com.chatbot.dto.settings;

public class GeneralSettingsResponse {
    
    private Boolean botEnabled;
    private Integer responseFrequency;
    private Boolean enableLogging;
    private Boolean enableAnalytics;
    
    public GeneralSettingsResponse() {}
    
    public GeneralSettingsResponse(Boolean botEnabled, Integer responseFrequency, 
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
