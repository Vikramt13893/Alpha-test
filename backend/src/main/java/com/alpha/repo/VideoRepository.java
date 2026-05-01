package com.alpha.repo;

import com.alpha.domain.VideoEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VideoRepository extends JpaRepository<VideoEntity, UUID> {

    List<VideoEntity> findByUploadedByOrderByCreatedAtDesc(String uploadedBy);

    List<VideoEntity> findAllByOrderByViewCountDescCreatedAtDesc(Pageable pageable);

    @Query("""
            SELECT v FROM VideoEntity v WHERE
            (COALESCE(:q, '') = '' OR LOWER(v.title) LIKE LOWER(CONCAT('%', :q, '%')))
            AND (COALESCE(:category, '') = '' OR (v.category IS NOT NULL AND LOWER(v.category) = LOWER(:category)))
            ORDER BY v.viewCount DESC, v.createdAt DESC
            """)
    List<VideoEntity> searchVideos(@Param("q") String q, @Param("category") String category, Pageable pageable);
}
