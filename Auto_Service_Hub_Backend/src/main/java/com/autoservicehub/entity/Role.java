package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * Maps to the 'roles' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {

    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String description;
}
