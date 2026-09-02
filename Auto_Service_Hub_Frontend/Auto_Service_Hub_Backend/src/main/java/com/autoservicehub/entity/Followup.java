package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

/**
 * Maps to the 'followups' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "followups")
public class Followup extends BaseEntity {

    @Column(name = "due_date")
    private LocalDate dueDate;
    @Column(name = "reason")
    private String reason;
    @Column(name = "status")
    private String status;
}
