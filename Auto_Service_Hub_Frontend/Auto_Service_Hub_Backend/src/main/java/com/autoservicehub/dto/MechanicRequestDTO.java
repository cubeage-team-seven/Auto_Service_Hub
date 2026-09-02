package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Mechanic create/update endpoints. Mechanic Management (SRS 4.6)
 * Extend with the fields listed for the 'Mechanic' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class MechanicRequestDTO {
    // TODO: map fields from entity.Mechanic per confirmed API contract (SRS 9)
}
