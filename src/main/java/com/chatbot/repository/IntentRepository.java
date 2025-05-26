
package com.chatbot.repository;

import com.chatbot.model.Intent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IntentRepository extends JpaRepository<Intent, Long> {
    
    Optional<Intent> findByName(String name);
    
    List<Intent> findByActiveTrue();
    
    @Query("SELECT i FROM Intent i WHERE i.active = true AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Intent> searchIntents(@Param("query") String query, Pageable pageable);
    
    boolean existsByName(String name);
}
