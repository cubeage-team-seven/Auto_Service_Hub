package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for ServicePackage create/update endpoints. Service Package Management (SRS 4.8)
 * Extend with the fields listed for the 'ServicePackage' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class ServicePackageRequestDTO {
    // TODO: map fields from entity.ServicePackage per confirmed API contract (SRS 9)
}
