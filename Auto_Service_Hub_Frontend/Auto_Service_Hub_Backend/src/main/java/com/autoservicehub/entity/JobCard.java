package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Maps to the 'job_cards' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "job_cards")
public class JobCard extends BaseEntity {

    @Column(name = "status")
    private String status;
    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
}
