package com.alpha.web;

import com.alpha.web.dto.ApiDtos.AdSlotsResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdController {

    @GetMapping("/ad-slots")
    public AdSlotsResponse listAdSlots() {
        return new AdSlotsResponse(List.of());
    }
}
