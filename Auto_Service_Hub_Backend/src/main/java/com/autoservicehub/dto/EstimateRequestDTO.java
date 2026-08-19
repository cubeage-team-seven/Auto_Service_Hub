package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Estimate create/update endpoints. Billing - Estimates (SRS 4.9)
 * Extend with the fields listed for the 'Estimate' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class EstimateRequestDTO {
    // TODO: map fields from entity.Estimate per confirmed API contract (SRS 9)
}
