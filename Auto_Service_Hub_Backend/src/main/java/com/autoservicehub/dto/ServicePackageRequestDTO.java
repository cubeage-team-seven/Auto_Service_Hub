package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class ServicePackageRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String type;
    @NotNull
    private BigDecimal price;
    private Boolean active;
}
