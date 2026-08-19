package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Part create/update endpoints. Spare Parts Inventory (SRS 4.7)
 * Extend with the fields listed for the 'Part' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class PartRequestDTO {
    // TODO: map fields from entity.Part per confirmed API contract (SRS 9)
}
