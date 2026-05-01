package com.alpha.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey secretKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.secretKey = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UUID userId, String email) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(properties.expirationMs());
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(secretKey)
                .compact();
    }

    public Parsed parse(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String sub = claims.getSubject();
        String email = claims.get("email", String.class);
        return new Parsed(sub, email != null ? email : "");
    }

    /** Access token TTL for API responses (whole seconds). */
    public long expirationSeconds() {
        return Math.max(1L, properties.expirationMs() / 1000L);
    }

    public record Parsed(String userId, String email) {}
}
