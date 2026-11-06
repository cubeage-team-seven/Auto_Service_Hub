package com.autoservicehub.controller;

import com.autoservicehub.dto.AccessRequestResponseDTO;
import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.CreateAccessRequestDTO;
import com.autoservicehub.service.AccessRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/access-requests")
@RequiredArgsConstructor
public class AccessRequestController {
    private final AccessRequestService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AccessRequestResponseDTO> submit(@Valid @RequestBody CreateAccessRequestDTO request) {
        return ApiResponse.ok("Access request submitted for administrator review", service.submit(request));
    }
}
