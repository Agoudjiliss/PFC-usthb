
package com.chatbot.repository;

import com.chatbot.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {
    
    Optional<Settings> findByKey(String key);
    
    boolean existsByKey(String key);
}
