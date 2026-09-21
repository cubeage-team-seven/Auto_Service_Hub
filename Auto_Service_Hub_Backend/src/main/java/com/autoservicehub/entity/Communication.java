package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Maps to the 'communications' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "communications")
public class Communication extends BaseEntity {

    @Column(name = "channel")
    private String channel;
    @Column(name = "message")
    private String message;
    @Column(name = "direction")
    private String direction;
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}
