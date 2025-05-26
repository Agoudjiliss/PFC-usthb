
package com.chatbot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rasa_models")
public class RasaModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String modelName;
    
    private String description;
    
    private String version;
    
    @Enumerated(EnumType.STRING)
    private ModelStatus status = ModelStatus.UPLOADED;
    
    @Column(nullable = false)
    private String filePath;
    
    private String originalFileName;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    private LocalDateTime activatedAt;
    
    @Column(nullable = false)
    private boolean isActive = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    public enum ModelStatus {
        UPLOADED, VALIDATING, VALIDATED, DEPLOYED, ERROR, INACTIVE
    }
    
    // Constructors
    public RasaModel() {}
    
    public RasaModel(String modelName, String description, String version, 
                    String filePath, String originalFileName, User uploadedBy) {
        this.modelName = modelName;
        this.description = description;
        this.version = version;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.uploadedBy = uploadedBy;
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
    
    public ModelStatus getStatus() { return status; }
    public void setStatus(ModelStatus status) { this.status = status; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    
    public LocalDateTime getActivatedAt() { return activatedAt; }
    public void setActivatedAt(LocalDateTime activatedAt) { this.activatedAt = activatedAt; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
}
