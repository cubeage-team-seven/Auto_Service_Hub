package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Invoice create/update endpoints. Billing - Invoices (SRS 4.9)
 * Extend with the fields listed for the 'Invoice' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class InvoiceRequestDTO {
    // TODO: map fields from entity.Invoice per confirmed API contract (SRS 9)
}
