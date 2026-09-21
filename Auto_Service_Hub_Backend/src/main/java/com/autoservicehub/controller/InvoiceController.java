package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.InvoiceRequestDTO;
import com.autoservicehub.dto.InvoiceResponseDTO;
import com.autoservicehub.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Billing - Invoices (SRS 4.9)
 * Base path: /api/v1/invoices
 * All endpoints require a valid JWT and are further restricted by role (SRS 13).
 */
@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<InvoiceResponseDTO> create(@Valid @RequestBody InvoiceRequestDTO request) {
        return ApiResponse.ok("Created", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InvoiceResponseDTO> update(@PathVariable Long id,
                                                    @Valid @RequestBody InvoiceRequestDTO request) {
        return ApiResponse.ok("Updated", service.update(id, request));
    }

    @GetMapping("/{id}")
    public ApiResponse<InvoiceResponseDTO> getById(@PathVariable Long id) {
        return ApiResponse.ok(service.getById(id));
    }

    @GetMapping
    public ApiResponse<Page<InvoiceResponseDTO>> list(Pageable pageable) {
        return ApiResponse.ok(service.list(pageable));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
