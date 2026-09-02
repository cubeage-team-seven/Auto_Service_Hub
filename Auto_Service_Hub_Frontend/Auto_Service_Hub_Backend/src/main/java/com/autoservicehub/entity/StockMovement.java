package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * Maps to the 'stock_movements' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "stock_movements")
public class StockMovement extends BaseEntity {

    @Column(name = "movement_type")
    private String movementType;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "reason")
    private String reason;
    @Column(name = "reference")
    private String reference;
}
