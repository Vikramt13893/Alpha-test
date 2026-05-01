package com.alpha.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "video")
public class VideoEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 512)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(length = 128)
    private String category;

    @Column(name = "s3_object_key", nullable = false, length = 1024)
    private String storageKey;

    @Column(name = "uploaded_by", nullable = false, length = 64)
    private String uploadedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected VideoEntity() {}

    public VideoEntity(
            UUID id,
            String title,
            String description,
            String thumbnailUrl,
            long viewCount,
            int durationSeconds,
            String category,
            String storageKey,
            String uploadedBy,
            Instant createdAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.viewCount = viewCount;
        this.durationSeconds = durationSeconds;
        this.category = category;
        this.storageKey = storageKey;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public long getViewCount() {
        return viewCount;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public String getCategory() {
        return category;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setViewCount(long viewCount) {
        this.viewCount = viewCount;
    }
}
