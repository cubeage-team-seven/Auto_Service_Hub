package com.autoservicehub.controller;

import com.autoservicehub.dto.*;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.service.AccessRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;
    private final AccessRequestService accessRequestService;

    @GetMapping("/users")
    @Transactional(readOnly = true)
    public ApiResponse<List<ManagedUserDTO>> users() {
        return ApiResponse.ok(userRepository.findAll().stream().map(ManagedUserDTO::from).toList());
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<String> createUser(@Valid @RequestBody CreateManagedUserDTO request) {
        accessRequestService.createManagedUser(request);
        return ApiResponse.ok("Account created", request.getUsername());
    }

    @GetMapping("/access-requests")
    public ApiResponse<List<AccessRequestResponseDTO>> accessRequests() {
        return ApiResponse.ok(accessRequestService.list());
    }

    @PostMapping("/access-requests/{id}/approve")
    public ApiResponse<AccessRequestResponseDTO> approve(
            @PathVariable Long id,
            @Valid @RequestBody ReviewAccessRequestDTO request,
            Authentication authentication) {
        return ApiResponse.ok("Access request approved",
                accessRequestService.approve(id, request, authentication.getName()));
    }

    @PostMapping("/access-requests/{id}/reject")
    public ApiResponse<AccessRequestResponseDTO> reject(
            @PathVariable Long id,
            @Valid @RequestBody RejectAccessRequestDTO request,
            Authentication authentication) {
        return ApiResponse.ok("Access request rejected",
                accessRequestService.reject(id, request, authentication.getName()));
    }
}
