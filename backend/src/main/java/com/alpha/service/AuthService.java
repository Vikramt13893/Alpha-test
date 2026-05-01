package com.alpha.service;

import com.alpha.domain.UserAccountEntity;
import com.alpha.repo.UserRepository;
import com.alpha.security.JwtService;
import com.alpha.web.dto.ApiDtos.TokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public TokenResponse register(String email, String password) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalized)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        UserAccountEntity user = new UserAccountEntity(
                UUID.randomUUID(),
                normalized,
                passwordEncoder.encode(password),
                Instant.now()
        );
        userRepository.save(user);
        return tokenFor(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(String email, String password) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        UserAccountEntity user = userRepository.findByEmailIgnoreCase(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return tokenFor(user);
    }

    private TokenResponse tokenFor(UserAccountEntity user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new TokenResponse(token, "Bearer", jwtService.expirationSeconds(), user.getEmail());
    }
}
