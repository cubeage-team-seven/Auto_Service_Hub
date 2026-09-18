package com.autoservicehub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class FollowupRequestDTO {
    @NotNull
    private Long customerId;
    private Long jobCardId;
    private LocalDate dueDate;
    private String reason;
    private String status;
}
