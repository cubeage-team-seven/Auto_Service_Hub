package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * Maps to the 'feedback' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "feedback")
public class Feedback extends BaseEntity {

    @Column(name = "rating")
    private Integer rating;
    @Column(name = "comments")
    private String comments;
}
