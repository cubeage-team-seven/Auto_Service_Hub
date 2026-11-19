package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class FollowupResponseDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long jobCardId;
    private String jobCardNumber;
    private Long vehicleId;
    private String vehicleMake;
    private String vehicleModel;
    private String registrationNumber;
    private Long assignedUserId;
    private String assignedUserName;
    private LocalDate dueDate;
    private java.time.LocalDateTime reminderAt;
    private String type;
    private String channel;
    private String reason;
    private String status;

    /** True once {@code dueDate} has arrived and the follow-up is still open. */
    private boolean due;

    /** True once the follow-up has been COMPLETED or CANCELLED. */
    private boolean closed;

    private LocalDateTime notifiedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
