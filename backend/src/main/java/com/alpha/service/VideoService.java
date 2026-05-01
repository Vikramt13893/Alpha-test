package com.alpha.service;

import com.alpha.domain.VideoEntity;
import com.alpha.repo.VideoRepository;
import com.alpha.web.dto.ApiDtos.Video;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VideoService {

    private static final int DEFAULT_DURATION_SECONDS = 60;

    private final VideoRepository videoRepository;
    private final VideoStorageService videoStorageService;

    public VideoService(VideoRepository videoRepository, VideoStorageService videoStorageService) {
        this.videoRepository = videoRepository;
        this.videoStorageService = videoStorageService;
    }

    @Transactional(readOnly = true)
    public List<Video> listTrending(int limit) {
        var page = PageRequest.of(0, Math.min(Math.max(limit, 1), 100));
        return videoRepository.findAllByOrderByViewCountDescCreatedAtDesc(page)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Video> listMine(String userId) {
        return videoRepository.findByUploadedByOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Video> findVideo(UUID id) {
        return videoRepository.findById(id).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public VideoEntity requireEntity(UUID id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Video upload(MultipartFile file, String title, String description, String category, String userId)
            throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file required");
        }
        UUID id = UUID.randomUUID();
        String storageKey = videoStorageService.store(file, id);
        Instant now = Instant.now();
        VideoEntity entity = new VideoEntity(
                id,
                title != null && !title.isBlank() ? title.trim() : "Untitled",
                blankToNull(description),
                null,
                0L,
                DEFAULT_DURATION_SECONDS,
                blankToNull(category),
                storageKey,
                userId,
                now
        );
        videoRepository.save(entity);
        return toDto(entity);
    }

    @Transactional
    public void recordView(UUID videoId) {
        VideoEntity entity = requireEntity(videoId);
        entity.setViewCount(entity.getViewCount() + 1);
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }

    private Video toDto(VideoEntity e) {
        return new Video(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getThumbnailUrl(),
                e.getViewCount(),
                e.getDurationSeconds(),
                e.getCategory(),
                e.getUploadedBy()
        );
    }

    public Instant playbackExpiry() {
        return Instant.now().plus(1, ChronoUnit.HOURS);
    }
}
