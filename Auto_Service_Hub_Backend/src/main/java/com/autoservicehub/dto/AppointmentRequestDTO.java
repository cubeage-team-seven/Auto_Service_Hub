package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentRequestDTO {
    @NotNull
    private Long customerId;
    @NotNull
    private Long vehicleId;
    @NotBlank
    private String serviceType;
    @NotNull
    private LocalDateTime appointmentAt;
    private Boolean pickupDrop;
    private String notes;
    private String status;
}
