package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * Maps to the 'audit_logs' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity {

    @Column(name = "entity_name")
    private String entityName;
    @Column(name = "entity_id")
    private String entityId;
    @Column(name = "action")
    private String action;
    @Column(name = "performed_by")
    private String performedBy;
    @Column(name = "details")
    private String details;
}
