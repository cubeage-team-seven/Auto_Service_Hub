package com.autoservicehub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FollowupRescheduleRequestDTO {
    @NotNull
    private LocalDateTime reminderAt;
}
