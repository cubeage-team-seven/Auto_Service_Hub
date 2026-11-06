package com.autoservicehub.dto;

import com.autoservicehub.entity.AccessRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AccessRequestResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String requestedRole;
    private String message;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String reviewNote;

    public static AccessRequestResponseDTO from(AccessRequest request) {
        AccessRequestResponseDTO dto = new AccessRequestResponseDTO();
        dto.setId(request.getId());
        dto.setName(request.getName());
        dto.setEmail(request.getEmail());
        dto.setPhone(request.getPhone());
        dto.setRequestedRole(request.getRequestedRole());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setReviewedAt(request.getReviewedAt());
        dto.setReviewNote(request.getReviewNote());
        return dto;
    }
}
