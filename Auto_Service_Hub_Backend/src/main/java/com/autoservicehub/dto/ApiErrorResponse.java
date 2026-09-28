package com.autoservicehub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Standard error envelope (SRS 9.1, 15). Includes correlation id for server-side log lookup.
 */
@Getter
@Setter
@AllArgsConstructor
public class ApiErrorResponse {
    private String code;
    private String message;
    private String correlationId;
    private LocalDateTime timestamp;
}
