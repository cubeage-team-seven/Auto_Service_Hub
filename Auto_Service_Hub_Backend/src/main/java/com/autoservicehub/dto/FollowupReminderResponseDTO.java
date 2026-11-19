package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FollowupReminderResponseDTO {
    private Long id;
    private LocalDateTime reminderAt;
    private String channel;
    private String status;
    private LocalDateTime sentAt;
    private String failureReason;
    private LocalDateTime createdAt;
}
