package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "followup_reminders", indexes = {
        @Index(name = "idx_followup_reminder_followup_id", columnList = "followup_id"),
        @Index(name = "idx_followup_reminder_status_due", columnList = "status, reminder_at")
})
public class FollowupReminder extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "followup_id", nullable = false)
    private Followup followup;

    @Column(name = "reminder_at", nullable = false)
    private LocalDateTime reminderAt;

    @Column(name = "channel", nullable = false, length = 32)
    private String channel;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;
}
