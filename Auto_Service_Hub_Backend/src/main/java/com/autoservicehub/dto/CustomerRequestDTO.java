package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Customer create/update endpoints. Customer CRM (SRS 4.1)
 * Extend with the fields listed for the 'Customer' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class CustomerRequestDTO {
    // TODO: map fields from entity.Customer per confirmed API contract (SRS 9)
}
