package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'job_tasks' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "job_tasks")
public class JobTask extends BaseEntity {

    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private String status;
    @Column(name = "labour_cost")
    private BigDecimal labourCost;
}
