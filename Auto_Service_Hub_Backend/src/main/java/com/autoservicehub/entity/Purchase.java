package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Maps to the 'purchases' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "purchases")
public class Purchase extends BaseEntity {

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    @Column(name = "status")
    private String status;
}
