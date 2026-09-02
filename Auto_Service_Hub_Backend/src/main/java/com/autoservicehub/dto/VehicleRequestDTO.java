package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class VehicleRequestDTO {
    @NotBlank
    private String registrationNo;
    private String make;
    private String model;
    private String variant;
    private Integer year;
    private String engineNo;
    private String chassisNo;
    private Integer mileage;
    private LocalDate insuranceExpiry;
    private LocalDate warrantyExpiry;
    private Long customerId;
}
