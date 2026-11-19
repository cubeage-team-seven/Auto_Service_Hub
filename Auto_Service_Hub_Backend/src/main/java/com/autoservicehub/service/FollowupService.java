package com.autoservicehub.service;

import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import com.autoservicehub.dto.FollowupDashboardDTO;
import com.autoservicehub.dto.FollowupAssigneeDTO;
import com.autoservicehub.dto.FollowupReminderResponseDTO;
import com.autoservicehub.dto.FollowupMessageRequestDTO;
import com.autoservicehub.dto.FollowupRescheduleRequestDTO;
import com.autoservicehub.dto.FollowupReminderStatusRequestDTO;
import com.autoservicehub.dto.CommunicationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

/**
 * Customer Follow-up & Retention (SRS 4.10)
 *
 * <p>Follow-ups move through PENDING → IN_PROGRESS → COMPLETED, or may be
 * CANCELLED. A follow-up that is still open and whose {@code dueDate} has
 * arrived is <em>due</em>, and the scheduled job raises a notification for it
 * exactly once.
 */
public interface FollowupService {

    FollowupResponseDTO create(FollowupRequestDTO request);

    FollowupResponseDTO update(Long id, FollowupRequestDTO request);

    FollowupResponseDTO getById(Long id);

    Page<FollowupResponseDTO> list(Pageable pageable);

    void delete(Long id);

    /** Open follow-ups, oldest due date first. */
    Page<FollowupResponseDTO> listPending(Pageable pageable);

    /** Open follow-ups that are due on or before {@code asOf}. */
    Page<FollowupResponseDTO> listDue(LocalDate asOf, Pageable pageable);

    /** Follow-ups belonging to one customer, newest due date first. */
    Page<FollowupResponseDTO> listByCustomer(Long customerId, Pageable pageable);

    Page<FollowupResponseDTO> search(String bucket, String status, String channel,
                                     String type, String query, Pageable pageable);

    FollowupDashboardDTO dashboard();

    java.util.List<FollowupAssigneeDTO> listAssignees();

    FollowupResponseDTO complete(Long id);

    FollowupResponseDTO cancel(Long id);

    FollowupResponseDTO reschedule(Long id, FollowupRescheduleRequestDTO request);

    Page<FollowupReminderResponseDTO> listReminders(Long id, Pageable pageable);

    FollowupReminderResponseDTO updateReminderStatus(Long followupId, Long reminderId,
                                                     FollowupReminderStatusRequestDTO request);

    Page<CommunicationResponseDTO> listMessages(Long id, Pageable pageable);

    CommunicationResponseDTO recordMessage(Long id, FollowupMessageRequestDTO request);

    /**
     * Raises an in-app notification for every open follow-up that is due and
     * has not been notified yet, then stamps the follow-up so it is never
     * notified twice.
     *
     * <p>Idempotent: running it again with nothing newly due creates no further
     * notifications.
     *
     * @return how many notifications were created
     */
    int notifyDueFollowUps(LocalDate asOf);
}
