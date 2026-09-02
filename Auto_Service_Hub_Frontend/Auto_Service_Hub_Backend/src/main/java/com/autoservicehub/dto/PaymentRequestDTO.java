package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Payment create/update endpoints. Billing - Payments (SRS 4.9)
 * Extend with the fields listed for the 'Payment' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class PaymentRequestDTO {
    // TODO: map fields from entity.Payment per confirmed API contract (SRS 9)
}
