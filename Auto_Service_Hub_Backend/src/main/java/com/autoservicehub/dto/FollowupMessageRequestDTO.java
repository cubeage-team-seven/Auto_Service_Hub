package com.autoservicehub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowupMessageRequestDTO {
    @NotBlank
    private String channel;

    private String subject;

    @NotBlank
    private String message;
}
