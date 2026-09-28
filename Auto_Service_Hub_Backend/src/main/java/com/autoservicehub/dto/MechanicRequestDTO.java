package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MechanicRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String employeeCode;
    private String phone;
    private Integer experienceYears;
    private String status;
}
