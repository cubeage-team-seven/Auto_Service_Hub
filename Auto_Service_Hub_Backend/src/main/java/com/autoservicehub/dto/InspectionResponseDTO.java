package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Outbound payload for Inspection endpoints. Never expose the JPA entity directly (SRS 9.1).
 */
@Getter
@Setter
public class InspectionResponseDTO {
    private Long id;
    private String complaint;
    private String technicianNotes;
    private BigDecimal estimatedCost;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
