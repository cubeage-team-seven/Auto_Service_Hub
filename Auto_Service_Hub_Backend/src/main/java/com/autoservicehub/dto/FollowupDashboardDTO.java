package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowupDashboardDTO {
    private long dueFollowups;
    private long pendingReminders;
    private long feedbackReceived;
    private long messagesSent;
    private double averageRating;
}
