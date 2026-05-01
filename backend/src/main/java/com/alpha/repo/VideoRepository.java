package com.alpha.repo;

import com.alpha.domain.VideoEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VideoRepository extends JpaRepository<VideoEntity, UUID> {

    List<VideoEntity> findByUploadedByOrderByCreatedAtDesc(String uploadedBy);

    List<VideoEntity> findAllByOrderByViewCountDescCreatedAtDesc(Pageable pageable);
}
