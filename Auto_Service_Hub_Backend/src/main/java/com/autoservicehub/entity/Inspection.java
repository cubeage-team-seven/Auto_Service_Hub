package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'inspections' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "inspections")
public class Inspection extends BaseEntity {

    @Column(name = "complaint")
    private String complaint;
    @Column(name = "technician_notes")
    private String technicianNotes;
    @Column(name = "estimated_cost")
    private BigDecimal estimatedCost;
    @Column(name = "status")
    private String status;
}
