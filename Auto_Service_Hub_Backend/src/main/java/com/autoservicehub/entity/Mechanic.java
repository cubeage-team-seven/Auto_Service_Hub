package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * Maps to the 'mechanics' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "mechanics")
public class Mechanic extends BaseEntity {

    @Column(name = "employee_code")
    private String employeeCode;
    @Column(name = "name")
    private String name;
    @Column(name = "phone")
    private String phone;
    @Column(name = "experience_years")
    private Integer experienceYears;
    @Column(name = "status")
    private String status;
}
