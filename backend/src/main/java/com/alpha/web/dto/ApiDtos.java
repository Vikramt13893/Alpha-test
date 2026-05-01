package com.alpha.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ApiDtos {

    private ApiDtos() {}

    public record HealthResponse(String status) {}

    public record RegisterRequest(
            @jakarta.validation.constraints.Email @jakarta.validation.constraints.NotBlank String email,
            @jakarta.validation.constraints.NotBlank
            @jakarta.validation.constraints.Size(min = 8, max = 200) String password
    ) {}

    public record LoginRequest(
            @jakarta.validation.constraints.Email @jakarta.validation.constraints.NotBlank String email,
            @jakarta.validation.constraints.NotBlank String password
    ) {}

    public record TokenResponse(
            String accessToken,
            String tokenType,
            long expiresInSeconds,
            String email
    ) {}

    public record Video(
            UUID id,
            String title,
            String description,
            String thumbnailUrl,
            long viewCount,
            int durationSeconds,
            String category,
            String uploadedBy
    ) {}

    public record TrendingVideosResponse(List<Video> items) {}

    public record PlaybackUrlResponse(String url, Instant expiresAt) {}

    public record RecordViewRequest(Integer watchSeconds) {}

    public record AdSlot(String position, String contentType, String payload) {}

    public record AdSlotsResponse(List<AdSlot> slots) {}
}
