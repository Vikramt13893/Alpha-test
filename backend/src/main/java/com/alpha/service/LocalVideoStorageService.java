package com.alpha.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.UUID;

@Service
public class LocalVideoStorageService implements VideoStorageService {

    private final Path rootDir;

    public LocalVideoStorageService(@Value("${alpha.storage.local.directory:./data/video-uploads}") String directory)
            throws IOException {
        this.rootDir = Path.of(directory).toAbsolutePath().normalize();
        Files.createDirectories(this.rootDir);
    }

    @Override
    public String store(MultipartFile file, UUID videoId) throws IOException {
        String original = file.getOriginalFilename();
        String ext = extensionOf(original);
        String relative = "local/" + videoId + ext;
        Path dest = rootDir.resolve(relative).normalize();
        if (!dest.startsWith(rootDir)) {
            throw new IllegalStateException("Invalid path");
        }
        Files.createDirectories(dest.getParent());
        file.transferTo(dest);
        return relative;
    }

    private static String extensionOf(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return ".mp4";
        }
        int dot = originalFilename.lastIndexOf('.');
        if (dot < 0) {
            return ".mp4";
        }
        return originalFilename.substring(dot).toLowerCase(Locale.ROOT);
    }

    @Override
    public Resource loadAsResource(String storageKey) {
        Path path = resolvePath(storageKey);
        return new FileSystemResource(path);
    }

    @Override
    public Path resolvePath(String storageKey) {
        Path path = rootDir.resolve(storageKey).normalize();
        if (!path.startsWith(rootDir)) {
            throw new IllegalStateException("Invalid storage key");
        }
        return path;
    }
}
