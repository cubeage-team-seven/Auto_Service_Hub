package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'estimates' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "estimates")
public class Estimate extends BaseEntity {

    @Column(name = "subtotal")
    private BigDecimal subtotal;
    @Column(name = "discount")
    private BigDecimal discount;
    @Column(name = "tax")
    private BigDecimal tax;
    @Column(name = "total")
    private BigDecimal total;
    @Column(name = "status")
    private String status;
}
