package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for JobCard create/update endpoints. Digital Job Card (SRS 4.5)
 * Extend with the fields listed for the 'JobCard' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class JobCardRequestDTO {
    // TODO: map fields from entity.JobCard per confirmed API contract (SRS 9)
}
