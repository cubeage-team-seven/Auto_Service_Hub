package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class JobCardRequestDTO {
    @NotNull
    private Long customerId;
    @NotNull
    private Long vehicleId;
    private Long mechanicId;
    private Long appointmentId;
    @NotBlank
    private String serviceType;
    private String complaint;
    private String technicianNotes;
    private Integer odometerReading;
    private LocalDateTime estimatedDelivery;
    private BigDecimal estimatedCost;
    private String status;
}
