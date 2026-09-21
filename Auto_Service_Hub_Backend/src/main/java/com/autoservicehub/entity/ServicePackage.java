package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'service_packages' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "service_packages")
public class ServicePackage extends BaseEntity {

    @Column(name = "name")
    private String name;
    @Column(name = "type")
    private String type;
    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "active")
    private Boolean active;
}
