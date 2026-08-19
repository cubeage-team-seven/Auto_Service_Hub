package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Inspection create/update endpoints. Vehicle Inspection (SRS 4.4)
 * Extend with the fields listed for the 'Inspection' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class InspectionRequestDTO {
    // TODO: map fields from entity.Inspection per confirmed API contract (SRS 9)
}
