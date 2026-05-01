package com.alpha.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "alpha.jwt")
public record JwtProperties(
        /** HS256 secret — must be at least 256 bits (32 bytes). Override via env in production. */
        String secret,
        /** Access token lifetime in milliseconds */
        long expirationMs
) {
    public JwtProperties {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("alpha.jwt.secret must be at least 32 characters");
        }
    }
}
