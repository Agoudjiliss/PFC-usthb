package com.chatbot.repository;

import com.chatbot.model.Resource;
import com.chatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByUploadedByOrderByCreatedAtDesc(User user);

    List<Resource> findByStatusOrderByCreatedAtDesc(Resource.ProcessingStatus status);

    @Query("SELECT COUNT(r) FROM Resource r WHERE r.createdAt >= :date")
    long countResourcesUploadedAfter(LocalDateTime date);

    @Query("SELECT r.status, COUNT(r) FROM Resource r GROUP BY r.status")
    List<Object[]> getResourceStatusCounts();

    @Query("SELECT COUNT(r) FROM Resource r WHERE r.status = ?1")
    long countByStatus(String status);
}