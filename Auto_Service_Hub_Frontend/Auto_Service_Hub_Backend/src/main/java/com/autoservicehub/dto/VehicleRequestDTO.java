package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Vehicle create/update endpoints. Vehicle Management (SRS 4.2)
 * Extend with the fields listed for the 'Vehicle' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class VehicleRequestDTO {
    // TODO: map fields from entity.Vehicle per confirmed API contract (SRS 9)
}
