package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Followup create/update endpoints. Customer Follow-up & Retention (SRS 4.10)
 * Extend with the fields listed for the 'Followup' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class FollowupRequestDTO {
    // TODO: map fields from entity.Followup per confirmed API contract (SRS 9)
}
