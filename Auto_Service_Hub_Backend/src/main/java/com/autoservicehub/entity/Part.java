package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'parts' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "parts")
public class Part extends BaseEntity {

    @Column(name = "sku")
    private String sku;
    @Column(name = "name")
    private String name;
    @Column(name = "unit")
    private String unit;
    @Column(name = "selling_price")
    private BigDecimal sellingPrice;
    @Column(name = "purchase_price")
    private BigDecimal purchasePrice;
    @Column(name = "stock_qty")
    private Integer stockQty;
    @Column(name = "min_stock")
    private Integer minStock;
}
