
package com.chatbot.dto.rasa;

import java.time.LocalDateTime;

public class RasaModelResponse {
    
    private Long id;
    private String modelName;
    private String description;
    private String version;
    private String status;
    private String filePath;
    private LocalDateTime uploadedAt;
    private boolean isActive;
    
    public RasaModelResponse() {}
    
    public RasaModelResponse(Long id, String modelName, String description, String version, 
                           String status, String filePath, LocalDateTime uploadedAt, boolean isActive) {
        this.id = id;
        this.modelName = modelName;
        this.description = description;
        this.version = version;
        this.status = status;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
        this.isActive = isActive;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
