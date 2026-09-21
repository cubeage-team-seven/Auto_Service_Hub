package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Outbound payload for Payment endpoints. Never expose the JPA entity directly (SRS 9.1).
 */
@Getter
@Setter
public class PaymentResponseDTO {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // TODO: map remaining fields from entity.Payment
}
