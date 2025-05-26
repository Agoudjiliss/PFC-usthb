
package com.chatbot.repository;

import com.chatbot.model.RasaModel;
import com.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RasaModelRepository extends JpaRepository<RasaModel, Long> {
    
    Optional<RasaModel> findByModelName(String modelName);
    
    List<RasaModel> findByUploadedByOrderByUploadedAtDesc(User user);
    
    Optional<RasaModel> findByIsActiveTrue();
    
    List<RasaModel> findByStatusOrderByUploadedAtDesc(RasaModel.ModelStatus status);
    
    boolean existsByModelName(String modelName);
    
    @Query("SELECT r FROM RasaModel r ORDER BY r.uploadedAt DESC")
    List<RasaModel> findAllOrderByUploadedAtDesc();
}
