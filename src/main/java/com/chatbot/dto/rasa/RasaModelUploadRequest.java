
package com.chatbot.dto.rasa;

import jakarta.validation.constraints.NotBlank;

public class RasaModelUploadRequest {
    
    @NotBlank
    private String modelName;
    
    private String description;
    
    private String version;
    
    public RasaModelUploadRequest() {}
    
    public RasaModelUploadRequest(String modelName, String description, String version) {
        this.modelName = modelName;
        this.description = description;
        this.version = version;
    }
    
    public String getModelName() {
        return modelName;
    }
    
    public void setModelName(String modelName) {
        this.modelName = modelName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
}
