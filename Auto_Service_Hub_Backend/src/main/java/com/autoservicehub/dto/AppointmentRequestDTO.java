package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for Appointment create/update endpoints. Appointment & Booking (SRS 4.3)
 * Extend with the fields listed for the 'Appointment' entity (SRS 8.2/8.3) and add
 * jakarta.validation annotations per SRS 14 (Validation Rules).
 */
@Getter
@Setter
public class AppointmentRequestDTO {
    // TODO: map fields from entity.Appointment per confirmed API contract (SRS 9)
}
