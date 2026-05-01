package com.alpha.web;

import com.alpha.domain.VideoEntity;
import com.alpha.service.VideoService;
import com.alpha.service.VideoStorageService;
import com.alpha.web.dto.ApiDtos.PlaybackUrlResponse;
import com.alpha.web.dto.ApiDtos.RecordViewRequest;
import com.alpha.web.dto.ApiDtos.CategoriesResponse;
import com.alpha.web.dto.ApiDtos.TrendingVideosResponse;
import com.alpha.web.dto.ApiDtos.Video;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * Implements paths from {@code openapi/openapi.yaml}.
 */
@Validated
@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;
    private final VideoStorageService videoStorageService;

    public VideoController(VideoService videoService, VideoStorageService videoStorageService) {
        this.videoService = videoService;
        this.videoStorageService = videoStorageService;
    }

    @GetMapping("/trending")
    public TrendingVideosResponse listTrendingVideos(
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit
    ) {
        return new TrendingVideosResponse(videoService.listTrending(limit));
    }

    @GetMapping("/mine")
    public TrendingVideosResponse listMyVideos(Authentication authentication) {
        return new TrendingVideosResponse(videoService.listMine(requireUserId(authentication)));
    }

    @GetMapping("/search")
    public TrendingVideosResponse searchVideos(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit
    ) {
        return new TrendingVideosResponse(videoService.search(q, category, limit));
    }

    @GetMapping("/categories")
    public CategoriesResponse listCategories() {
        return new CategoriesResponse(videoService.listCategories());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Video> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            Authentication authentication
    ) throws IOException {
        Video created = videoService.upload(
                file, title, description, category, requireUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    private static String requireUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return authentication.getPrincipal().toString();
    }

    @GetMapping("/{videoId}/stream")
    public ResponseEntity<Resource> streamVideo(@PathVariable UUID videoId) throws IOException {
        VideoEntity entity = videoService.requireEntity(videoId);
        Resource resource = videoStorageService.loadAsResource(entity.getStorageKey());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        Path path = videoStorageService.resolvePath(entity.getStorageKey());
        String contentType = Files.probeContentType(path);
        String ct = contentType != null ? contentType : "video/mp4";
        return ResponseEntity.ok()
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .contentType(MediaType.parseMediaType(ct))
                .body(resource);
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<Video> getVideoById(@PathVariable UUID videoId) {
        return videoService.findVideo(videoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{videoId}/playback-url")
    public ResponseEntity<PlaybackUrlResponse> getPlaybackUrl(@PathVariable UUID videoId) {
        try {
            videoService.requireEntity(videoId);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
        // Relative path works with the Vite dev proxy and any reverse proxy in front of the API.
        String streamUrl = "/api/videos/" + videoId + "/stream";
        return ResponseEntity.ok(new PlaybackUrlResponse(streamUrl, videoService.playbackExpiry()));
    }

    @PostMapping("/{videoId}/views")
    public ResponseEntity<Void> recordView(
            @PathVariable UUID videoId,
            @RequestBody(required = false) RecordViewRequest body
    ) {
        try {
            videoService.recordView(videoId);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.notFound().build();
            }
            throw e;
        }
    }
}
