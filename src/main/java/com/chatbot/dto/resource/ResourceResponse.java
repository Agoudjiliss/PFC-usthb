
package com.chatbot.dto.resource;

import com.chatbot.model.Resource;
import java.time.LocalDateTime;

public class ResourceResponse {
    private Long id;
    private String fileName;
    private String description;
    private String fileType;
    private Long fileSize;
    private Resource.ProcessingStatus status;
    private LocalDateTime uploadedAt;
    private String uploadedBy;
    
    public ResourceResponse(Resource resource) {
        this.id = resource.getId();
        this.fileName = resource.getFilename();
        this.description = null; // description field doesn't exist in Resource model
        this.fileType = resource.getContentType();
        this.fileSize = resource.getFileSize();
        this.status = resource.getStatus();
        this.uploadedAt = resource.getUploadedAt();
        this.uploadedBy = resource.getUploadedBy() != null ? resource.getUploadedBy().getUsername() : null;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public Resource.ProcessingStatus getStatus() { return status; }
    public void setStatus(Resource.ProcessingStatus status) { this.status = status; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
}
