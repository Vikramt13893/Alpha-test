package com.alpha.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.UUID;

public interface VideoStorageService {

    String store(MultipartFile file, UUID videoId) throws java.io.IOException;

    Resource loadAsResource(String storageKey);

    Path resolvePath(String storageKey);
}
