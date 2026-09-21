package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.JobCardRequestDTO;
import com.autoservicehub.dto.JobCardResponseDTO;
import com.autoservicehub.service.JobCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Digital Job Card (SRS 4.5)
 * Base path: /api/v1/job-cards
 * All endpoints require a valid JWT and are further restricted by role (SRS 13).
 */
@RestController
@RequestMapping("/api/v1/job-cards")
@RequiredArgsConstructor
public class JobCardController {

    private final JobCardService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<JobCardResponseDTO> create(@Valid @RequestBody JobCardRequestDTO request) {
        return ApiResponse.ok("Created", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<JobCardResponseDTO> update(@PathVariable Long id,
                                                    @Valid @RequestBody JobCardRequestDTO request) {
        return ApiResponse.ok("Updated", service.update(id, request));
    }

    @GetMapping("/{id}")
    public ApiResponse<JobCardResponseDTO> getById(@PathVariable Long id) {
        return ApiResponse.ok(service.getById(id));
    }

    @GetMapping
    public ApiResponse<Page<JobCardResponseDTO>> list(Pageable pageable) {
        return ApiResponse.ok(service.list(pageable));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
