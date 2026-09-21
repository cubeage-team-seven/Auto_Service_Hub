package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PartResponseDTO {
    private Long id;
    private String sku;
    private String name;
    private String unit;
    private BigDecimal sellingPrice;
    private BigDecimal purchasePrice;
    private Integer stockQty;
    private Integer minStock;
    private boolean lowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
