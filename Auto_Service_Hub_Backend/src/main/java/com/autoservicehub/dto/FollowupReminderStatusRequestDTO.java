package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowupReminderStatusRequestDTO {
    @NotBlank
    private String status;

    private String failureReason;
}
