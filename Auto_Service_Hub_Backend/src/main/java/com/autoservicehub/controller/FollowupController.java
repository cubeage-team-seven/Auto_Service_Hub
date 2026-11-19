package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import com.autoservicehub.dto.FollowupDashboardDTO;
import com.autoservicehub.dto.FollowupAssigneeDTO;
import com.autoservicehub.dto.FollowupReminderResponseDTO;
import com.autoservicehub.dto.FollowupMessageRequestDTO;
import com.autoservicehub.dto.FollowupRescheduleRequestDTO;
import com.autoservicehub.dto.FollowupReminderStatusRequestDTO;
import com.autoservicehub.dto.CommunicationResponseDTO;
import com.autoservicehub.service.FollowupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Customer Follow-up & Retention (SRS 4.10)
 * Base path: /api/v1/followups
 * All endpoints require a valid JWT and are further restricted by role (SRS 13).
 */
@RestController
@RequestMapping("/api/v1/followups")
@RequiredArgsConstructor
public class FollowupController {

    private final FollowupService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<FollowupResponseDTO> create(@Valid @RequestBody FollowupRequestDTO request) {
        return ApiResponse.ok("Created", service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupResponseDTO> update(@PathVariable Long id,
                                                    @Valid @RequestBody FollowupRequestDTO request) {
        return ApiResponse.ok("Updated", service.update(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'INVENTORY_MANAGER', 'BILLING_USER')")
    public ApiResponse<FollowupResponseDTO> getById(@PathVariable Long id) {
        return ApiResponse.ok(service.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'INVENTORY_MANAGER', 'BILLING_USER')")
    public ApiResponse<Page<FollowupResponseDTO>> list(
            @RequestParam(required = false) String bucket,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String q,
            Pageable pageable) {
        return ApiResponse.ok(service.search(bucket, status, channel, type, q, pageable));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupDashboardDTO> dashboard() {
        return ApiResponse.ok(service.dashboard());
    }

    @GetMapping("/assignees")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<java.util.List<FollowupAssigneeDTO>> assignees() {
        return ApiResponse.ok(service.listAssignees());
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupResponseDTO> complete(@PathVariable Long id) {
        return ApiResponse.ok("Completed", service.complete(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupResponseDTO> cancel(@PathVariable Long id) {
        return ApiResponse.ok("Cancelled", service.cancel(id));
    }

    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupResponseDTO> reschedule(
            @PathVariable Long id,
            @Valid @RequestBody FollowupRescheduleRequestDTO request) {
        return ApiResponse.ok("Rescheduled", service.reschedule(id, request));
    }

    @GetMapping("/{id}/reminders")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<Page<FollowupReminderResponseDTO>> reminders(
            @PathVariable Long id, Pageable pageable) {
        return ApiResponse.ok(service.listReminders(id, pageable));
    }

    @PatchMapping("/{id}/reminders/{reminderId}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<FollowupReminderResponseDTO> updateReminderStatus(
            @PathVariable Long id,
            @PathVariable Long reminderId,
            @Valid @RequestBody FollowupReminderStatusRequestDTO request) {
        return ApiResponse.ok(service.updateReminderStatus(id, reminderId, request));
    }

    @GetMapping("/{id}/messages")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<Page<CommunicationResponseDTO>> messages(
            @PathVariable Long id, Pageable pageable) {
        return ApiResponse.ok(service.listMessages(id, pageable));
    }

    @PostMapping("/{id}/messages")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CommunicationResponseDTO> recordMessage(
            @PathVariable Long id,
            @Valid @RequestBody FollowupMessageRequestDTO request) {
        return ApiResponse.ok("Message recorded; external delivery is not configured",
                service.recordMessage(id, request));
    }

    /**
     * Open follow-ups, oldest due date first.
     * GET /api/v1/followups/pending?page=0&size=20
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'INVENTORY_MANAGER', 'BILLING_USER')")
    public ApiResponse<Page<FollowupResponseDTO>> listPending(Pageable pageable) {
        return ApiResponse.ok(service.listPending(pageable));
    }

    /**
     * Open follow-ups due on or before the given date (today when omitted).
     * GET /api/v1/followups/due?asOf=2026-10-01
     */
    @GetMapping("/due")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'INVENTORY_MANAGER', 'BILLING_USER')")
    public ApiResponse<Page<FollowupResponseDTO>> listDue(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOf,
            Pageable pageable) {
        return ApiResponse.ok(service.listDue(asOf != null ? asOf : LocalDate.now(), pageable));
    }

    /**
     * Follow-ups belonging to one customer.
     * GET /api/v1/followups/customer/{customerId}?page=0&size=20
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'INVENTORY_MANAGER', 'BILLING_USER')")
    public ApiResponse<Page<FollowupResponseDTO>> listByCustomer(
            @PathVariable Long customerId,
            Pageable pageable) {
        return ApiResponse.ok(service.listByCustomer(customerId, pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'GARAGE_OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
