package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Inbound payload for Inspection create/update endpoints. Vehicle Inspection (SRS 4.4)
 * Extend with the fields listed for the 'Inspection' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class InspectionRequestDTO {
    private String complaint;
    private String technicianNotes;
    private BigDecimal estimatedCost;
    private String status;
}
