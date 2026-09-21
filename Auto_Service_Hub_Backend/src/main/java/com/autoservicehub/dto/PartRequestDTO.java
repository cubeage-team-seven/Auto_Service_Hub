package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class PartRequestDTO {
    @NotBlank
    private String sku;
    @NotBlank
    private String name;
    private String unit;
    @NotNull
    private BigDecimal sellingPrice;
    private BigDecimal purchasePrice;
    private Integer stockQty;
    private Integer minStock;
}
