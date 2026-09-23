package com.autoservicehub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Inbound payload for Estimate create/update endpoints. Billing - Estimates (SRS 4.9)
 * Extend with the fields listed for the 'Estimate' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class EstimateRequestDTO {
    @NotNull
    private BigDecimal subtotal;

    @NotNull
    private BigDecimal discount;

    @NotNull
    private BigDecimal tax;

    @NotNull
    private BigDecimal total;

    private String status;
}
