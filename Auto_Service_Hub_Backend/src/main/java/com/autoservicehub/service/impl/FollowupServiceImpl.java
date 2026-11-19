package com.autoservicehub.service.impl;

import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import com.autoservicehub.dto.FollowupDashboardDTO;
import com.autoservicehub.dto.FollowupAssigneeDTO;
import com.autoservicehub.dto.FollowupReminderResponseDTO;
import com.autoservicehub.dto.FollowupMessageRequestDTO;
import com.autoservicehub.dto.FollowupRescheduleRequestDTO;
import com.autoservicehub.dto.FollowupReminderStatusRequestDTO;
import com.autoservicehub.dto.CommunicationResponseDTO;
import com.autoservicehub.entity.Communication;
import com.autoservicehub.entity.Customer;
import com.autoservicehub.entity.Followup;
import com.autoservicehub.entity.FollowupReminder;
import com.autoservicehub.entity.JobCard;
import com.autoservicehub.entity.User;
import com.autoservicehub.entity.Vehicle;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.CommunicationRepository;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.repository.FeedbackRepository;
import com.autoservicehub.repository.FollowupRepository;
import com.autoservicehub.repository.FollowupReminderRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.repository.VehicleRepository;
import com.autoservicehub.service.FollowupService;
import com.autoservicehub.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.JoinType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Customer Follow-up & Retention (SRS 4.10).
 *
 * <p>Rules enforced here:
 * <ul>
 *   <li>the customer must exist, and a job card, when given, must exist and
 *       must belong to that same customer — a follow-up cannot be raised
 *       against a job for somebody else;</li>
 *   <li>status is restricted to the follow-up workflow's own states;</li>
 *   <li>a newly created follow-up may not be dated in the past, since a
 *       reminder that was already missed is a data-entry error (an existing
 *       follow-up naturally becomes overdue as time passes, which is fine);</li>
 *   <li>re-opening a follow-up that was already notified clears the stamp, so a
 *       genuinely new reminder can be raised for it again.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FollowupServiceImpl implements FollowupService {

    /** Follow-up workflow states. */
    public static final String STATUS_PENDING     = "PENDING";
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED   = "COMPLETED";
    public static final String STATUS_CANCELLED   = "CANCELLED";
    private static final String OWNER_STORED_ALIAS = "GARAGE_OWNER";

    /** States in which a follow-up still needs doing. */
    public static final List<String> OPEN_STATUSES = List.of(STATUS_PENDING, STATUS_IN_PROGRESS);

    private static final List<String> ALL_STATUSES =
            List.of(STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_COMPLETED, STATUS_CANCELLED);
    private static final Set<String> MESSAGE_CHANNELS =
            Set.of("EMAIL", "SMS", "WHATSAPP", "CALL", "REMINDER", "IN_PERSON");
    private static final Set<String> FOLLOWUP_CHANNELS =
            Set.of("PHONE_CALL", "CALL", "WHATSAPP", "SMS", "EMAIL", "IN_PERSON");
    private static final List<String> ASSIGNABLE_ROLES = List.of(
            AppConstants.ROLE_SERVICE_ADVISOR,
            AppConstants.ROLE_MANAGER,
            AppConstants.ROLE_OWNER,
            OWNER_STORED_ALIAS,
            "MECHANIC");

    /**
     * The garage-owner role as it is spelled in the {@code roles} table by a
     * deployment that does not store it as {@link AppConstants#ROLE_OWNER}.
     *
     * <p>A literal rather than an {@code AppConstants} entry because it names a
     * stored row, not a role the code reasons about — and the lookup below
     * matches the database name, so the stored spelling is the one it needs.
     * Listing both spellings means the owner is notified either way; neither
     * replaces the other.
     */
    /**
     * Roles that handle customer contact, and so are notified when a follow-up
     * falls due. Taken from the project's existing role constants, plus the
     * garage-owner spelling above.
     */
    private static final List<String> NOTIFY_ROLES = List.of(
            AppConstants.ROLE_SERVICE_ADVISOR,
            AppConstants.ROLE_MANAGER,
            AppConstants.ROLE_OWNER,
            OWNER_STORED_ALIAS);

    private final FollowupRepository        repository;
    private final CustomerRepository       customerRepository;
    private final JobCardRepository        jobCardRepository;
    private final UserRepository           userRepository;
    private final NotificationServiceImpl  notificationService;
    private final VehicleRepository        vehicleRepository;
    private final FollowupReminderRepository reminderRepository;
    private final FeedbackRepository       feedbackRepository;
    private final CommunicationRepository  communicationRepository;

    @Override
    public FollowupResponseDTO create(FollowupRequestDTO request) {
        Followup entity = new Followup();
        mapToEntity(request, entity, true);
        Followup saved = repository.save(entity);
        createReminder(saved);
        return toResponse(saved);
    }

    @Override
    public FollowupResponseDTO update(Long id, FollowupRequestDTO request) {
        Followup existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id));
        LocalDateTime previousReminderAt = existing.getReminderAt();
        String previousStatus = existing.getStatus();
        mapToEntity(request, existing, false);
        boolean scheduleChanged = !java.util.Objects.equals(previousReminderAt, existing.getReminderAt());
        if (scheduleChanged && OPEN_STATUSES.contains(existing.getStatus())) {
            existing.setNotifiedAt(null);
        }
        Followup saved = repository.save(existing);
        boolean reopened = isClosedStatus(previousStatus) && !isClosedStatus(saved.getStatus());
        if (scheduleChanged || reopened) {
            cancelPendingReminders(saved);
            createReminder(saved);
        }
        if (isClosedStatus(saved.getStatus())) cancelPendingReminders(saved);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FollowupResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> list(Pageable pageable) {
        return search(null, null, null, null, null, pageable);
    }

    @Override
    public void delete(Long id) {
        findFollowup(id);
        if (reminderRepository.existsByFollowupId(id) || communicationRepository.existsByFollowupId(id)) {
            throw new BusinessRuleException(
                    "Follow-ups with reminder or communication history cannot be deleted; cancel them instead.");
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> listPending(Pageable pageable) {
        return repository.findByStatusInOrderByDueDateAscIdAsc(OPEN_STATUSES, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> listDue(LocalDate asOf, Pageable pageable) {
        return repository.findByStatusInAndDueDateLessThanEqualOrderByDueDateAscIdAsc(
                OPEN_STATUSES, asOf, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> listByCustomer(Long customerId, Pageable pageable) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found: " + customerId);
        }
        return repository.findByCustomerIdOrderByDueDateDesc(customerId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> search(String bucket, String status, String channel,
                                             String type, String query, Pageable pageable) {
        LocalDate today = LocalDate.now();
        Specification<Followup> specification = (root, criteriaQuery, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            String normalizedStatus = normalizeFilter(status);
            if (normalizedStatus != null && !normalizedStatus.equals("ALL")) {
                predicates.add(cb.equal(cb.upper(root.get("status")), normalizedStatus));
            }
            String normalizedChannel = normalizeFilter(channel);
            if (normalizedChannel != null && !normalizedChannel.equals("ALL")) {
                predicates.add(cb.equal(cb.upper(root.get("channel")), normalizedChannel));
            }
            String normalizedType = normalizeFilter(type);
            if (normalizedType != null && !normalizedType.equals("ALL")) {
                predicates.add(cb.equal(cb.lower(root.get("type")), normalizedType.toLowerCase(Locale.ROOT)));
            }
            String normalizedBucket = normalizeFilter(bucket);
            if ("COMPLETED".equals(normalizedBucket)) {
                predicates.add(cb.equal(cb.upper(root.get("status")), STATUS_COMPLETED));
            } else if ("OVERDUE".equals(normalizedBucket)) {
                predicates.add(cb.and(root.get("status").in(OPEN_STATUSES),
                        cb.lessThan(root.get("dueDate"), today)));
            } else if ("DUE-TODAY".equals(normalizedBucket)) {
                predicates.add(cb.and(root.get("status").in(OPEN_STATUSES),
                        cb.equal(root.get("dueDate"), today)));
            } else if ("UPCOMING".equals(normalizedBucket)) {
                predicates.add(cb.and(root.get("status").in(OPEN_STATUSES),
                        cb.greaterThan(root.get("dueDate"), today)));
            }
            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
                var customer = root.join("customer", JoinType.LEFT);
                var vehicle = root.join("vehicle", JoinType.LEFT);
                var jobCard = root.join("jobCard", JoinType.LEFT);
                predicates.add(cb.or(
                        cb.like(cb.lower(customer.get("name")), pattern),
                        cb.like(cb.lower(customer.get("phone")), pattern),
                        cb.like(cb.lower(vehicle.get("registrationNo")), pattern),
                        cb.like(cb.lower(vehicle.get("make")), pattern),
                        cb.like(cb.lower(vehicle.get("model")), pattern),
                        cb.like(cb.lower(jobCard.get("jobCardNumber")), pattern)));
            }
            return cb.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
        };
        return repository.findAll(specification, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public FollowupDashboardDTO dashboard() {
        FollowupDashboardDTO dto = new FollowupDashboardDTO();
        dto.setDueFollowups(repository.count((root, query, cb) -> cb.and(
                root.get("status").in(OPEN_STATUSES),
                cb.lessThanOrEqualTo(root.get("dueDate"), LocalDate.now()))));
        dto.setPendingReminders(reminderRepository.countByStatus("PENDING"));
        dto.setFeedbackReceived(feedbackRepository.count());
        dto.setMessagesSent(communicationRepository.countByDeliveryStatus("SENT"));
        Double averageRating = feedbackRepository.findAverageRating();
        dto.setAverageRating(averageRating != null ? averageRating : 0.0);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowupAssigneeDTO> listAssignees() {
        return userRepository.findActiveByRoleNameIn(ASSIGNABLE_ROLES).stream()
                .map(user -> new FollowupAssigneeDTO(user.getId(),
                        user.getFullName() != null ? user.getFullName() : user.getUsername()))
                .toList();
    }

    @Override
    public FollowupResponseDTO complete(Long id) {
        Followup followup = findFollowup(id);
        followup.setStatus(STATUS_COMPLETED);
        cancelPendingReminders(followup);
        return toResponse(repository.save(followup));
    }

    @Override
    public FollowupResponseDTO cancel(Long id) {
        Followup followup = findFollowup(id);
        followup.setStatus(STATUS_CANCELLED);
        cancelPendingReminders(followup);
        return toResponse(repository.save(followup));
    }

    @Override
    public FollowupResponseDTO reschedule(Long id, FollowupRescheduleRequestDTO request) {
        Followup followup = findFollowup(id);
        LocalDateTime reminderAt = request.getReminderAt();
        if (reminderAt.isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("The reminder time cannot be in the past.");
        }
        if (!OPEN_STATUSES.contains(followup.getStatus())) {
            throw new BusinessRuleException("Only open follow-ups can be rescheduled.");
        }
        followup.setReminderAt(reminderAt);
        followup.setDueDate(reminderAt.toLocalDate());
        followup.setNotifiedAt(null);
        Followup saved = repository.save(followup);
        cancelPendingReminders(saved);
        createReminder(saved);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupReminderResponseDTO> listReminders(Long id, Pageable pageable) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Followup not found: " + id);
        }
        return reminderRepository.findByFollowupIdOrderByCreatedAtDesc(id, pageable)
                .map(this::toReminderResponse);
    }

    @Override
    public FollowupReminderResponseDTO updateReminderStatus(
            Long followupId, Long reminderId, FollowupReminderStatusRequestDTO request) {
        FollowupReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found: " + reminderId));
        if (!reminder.getFollowup().getId().equals(followupId)) {
            throw new ResourceNotFoundException("Reminder not found for follow-up: " + followupId);
        }
        String status = normalizeFilter(request.getStatus());
        if (!"FAILED".equals(status) && !"CANCELLED".equals(status)) {
            throw new BusinessRuleException(
                    "Only FAILED or CANCELLED can be set manually; SENT requires provider confirmation.");
        }
        if ("FAILED".equals(status)
                && (request.getFailureReason() == null || request.getFailureReason().isBlank())) {
            throw new BusinessRuleException("failureReason is required when a reminder fails.");
        }
        if (!"PENDING".equals(reminder.getStatus())) {
            throw new BusinessRuleException("Only pending reminders can be changed.");
        }
        reminder.setStatus(status);
        reminder.setFailureReason("FAILED".equals(status) ? request.getFailureReason() : null);
        return toReminderResponse(reminderRepository.save(reminder));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommunicationResponseDTO> listMessages(Long id, Pageable pageable) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Followup not found: " + id);
        }
        return communicationRepository.findByFollowupIdOrderByCreatedAtDesc(id, pageable)
                .map(this::toCommunicationResponse);
    }

    @Override
    public CommunicationResponseDTO recordMessage(Long id, FollowupMessageRequestDTO request) {
        Followup followup = findFollowup(id);
        String channel = request.getChannel().trim().toUpperCase(Locale.ROOT)
                .replace("PHONE_CALL", "CALL");
        if (!MESSAGE_CHANNELS.contains(channel)) {
            throw new BusinessRuleException("Unsupported communication channel: " + request.getChannel());
        }
        Communication communication = new Communication();
        communication.setCustomer(followup.getCustomer());
        communication.setJobCard(followup.getJobCard());
        communication.setFollowup(followup);
        communication.setChannel(channel);
        communication.setDirection("OUTBOUND");
        communication.setSubject(request.getSubject());
        communication.setMessage(request.getMessage().trim());
        communication.setDeliveryStatus("RECORDED");
        communication.setSentAt(null);
        return toCommunicationResponse(communicationRepository.save(communication));
    }

    // ── Due-follow-up → notification ──────────────────────────────────────

    /**
     * Notifies the customer-facing staff about every open follow-up that is due
     * and has not been notified yet.
     *
     * <p>Idempotent on two levels: only un-notified follow-ups are selected
     * ({@code notifiedAt IS NULL}), and each notification write is additionally
     * guarded by the user/reference pair, so a follow-up cannot produce two
     * notifications for the same recipient even if the stamp were lost.
     *
     * <p>The follow-up is stamped only after its notifications are written, so
     * a failure part-way through rolls the whole batch back and the follow-up
     * is picked up again on the next run rather than being silently skipped.
     *
     * <p>Notification text carries the follow-up and job-card ids only — no
     * customer name or phone number is copied in.
     */
    @Override
    @Transactional
    public int notifyDueFollowUps(LocalDate asOf) {
        List<Followup> due = repository
                .findByStatusInAndDueDateLessThanEqualAndNotifiedAtIsNullOrderByIdAsc(
                        OPEN_STATUSES, asOf);

        int created = 0;
        for (Followup followup : due) {
            for (User user : userRepository.findActiveByRoleNameIn(NOTIFY_ROLES)) {
                boolean made = notificationService.notifyUserOnce(
                        user.getId(),
                        "Follow-up due: " + shortReason(followup.getReason()),
                        buildMessage(followup, asOf),
                        NotificationServiceImpl.REFERENCE_FOLLOWUP,
                        followup.getId());
                if (made) {
                    created++;
                }
            }
            followup.setNotifiedAt(LocalDateTime.now());
        }
        if (!due.isEmpty()) {
            repository.saveAll(due);
        }
        return created;
    }

    private String buildMessage(Followup followup, LocalDate asOf) {
        StringBuilder sb = new StringBuilder();
        sb.append("Follow-up ").append(followup.getId());
        if (followup.getJobCard() != null) {
            sb.append(" for job card ").append(followup.getJobCard().getId());
        }
        if (followup.getCustomer() != null) {
            sb.append(" (customer ").append(followup.getCustomer().getId()).append(")");
        }
        sb.append(" is due on ").append(followup.getDueDate());
        if (followup.getDueDate() != null && followup.getDueDate().isBefore(asOf)) {
            sb.append(" and is overdue");
        }
        sb.append(". Reason: ").append(followup.getReason());
        return sb.toString();
    }

    private String shortReason(String reason) {
        if (reason == null) {
            return "(no reason given)";
        }
        return reason.length() <= 60 ? reason : reason.substring(0, 57) + "...";
    }

    // ── Private helpers ───────────────────────────────────────────────────

    /**
     * Resolves and checks the references, the status and the due date.
     *
     * @param isNew true on create, which additionally refuses a due date that
     *              has already passed
     */
    private void mapToEntity(FollowupRequestDTO r, Followup e, boolean isNew) {
        Customer customer = customerRepository.findById(r.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found: " + r.getCustomerId()));
        e.setCustomer(customer);
        LocalDate previousDueDate = e.getDueDate();

        JobCard jobCard = null;
        if (r.getJobCardId() != null) {
            jobCard = jobCardRepository.findById(r.getJobCardId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "JobCard not found: " + r.getJobCardId()));
            // A follow-up must relate to one of this customer's own visits.
            if (jobCard.getCustomer() == null
                    || !jobCard.getCustomer().getId().equals(customer.getId())) {
                throw new BusinessRuleException(
                        "JobCard " + r.getJobCardId() + " belongs to a different customer and cannot "
                        + "be linked to a follow-up for customer " + customer.getId() + ".");
            }
            e.setJobCard(jobCard);
        } else {
            e.setJobCard(null);
        }

        Vehicle vehicle = null;
        if (r.getVehicleId() != null) {
            vehicle = vehicleRepository.findById(r.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Vehicle not found: " + r.getVehicleId()));
            if (vehicle.getCustomer() == null
                    || !vehicle.getCustomer().getId().equals(customer.getId())) {
                throw new BusinessRuleException("The selected vehicle does not belong to this customer.");
            }
        } else if (jobCard != null) {
            vehicle = jobCard.getVehicle();
        }
        if (vehicle != null && (vehicle.getCustomer() == null
                || !vehicle.getCustomer().getId().equals(customer.getId()))) {
            throw new BusinessRuleException("The selected vehicle does not belong to this customer.");
        }
        if (jobCard != null && vehicle != null && jobCard.getVehicle() != null
                && !jobCard.getVehicle().getId().equals(vehicle.getId())) {
            throw new BusinessRuleException("The selected vehicle does not match the job card.");
        }
        e.setVehicle(vehicle);

        if (r.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(r.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Assigned user not found: " + r.getAssignedUserId()));
            if (!Boolean.TRUE.equals(assignedUser.getActive())) {
                throw new BusinessRuleException("The assigned workshop user is inactive.");
            }
            String roleName = assignedUser.getRole() == null ? null : assignedUser.getRole().getName();
            if (roleName == null
                    || !ASSIGNABLE_ROLES.contains(roleName.toUpperCase(Locale.ROOT))) {
                throw new BusinessRuleException("The selected user cannot be assigned to follow-ups.");
            }
            e.setAssignedUser(assignedUser);
        } else {
            e.setAssignedUser(null);
        }

        if (r.getDueDate() == null) {
            throw new BusinessRuleException("dueDate is required.");
        }
        if (r.getReminderAt() != null && !r.getDueDate().equals(r.getReminderAt().toLocalDate())) {
            throw new BusinessRuleException("reminderAt must fall on dueDate.");
        }
        e.setDueDate(r.getDueDate());
        e.setReminderAt(r.getReminderAt() != null
                ? r.getReminderAt()
                : (isNew || !java.util.Objects.equals(previousDueDate, r.getDueDate())
                    || e.getReminderAt() == null
                    ? r.getDueDate().atTime(9, 0)
                    : e.getReminderAt()));
        e.setType(r.getType() == null || r.getType().isBlank() ? "Service Reminder" : r.getType().trim());
        String followupChannel = r.getChannel() == null || r.getChannel().isBlank()
                ? "PHONE_CALL" : r.getChannel().trim().toUpperCase(Locale.ROOT);
        if (!FOLLOWUP_CHANNELS.contains(followupChannel)) {
            throw new BusinessRuleException("Unsupported follow-up channel: " + r.getChannel());
        }
        e.setChannel("CALL".equals(followupChannel) ? "PHONE_CALL" : followupChannel);
        e.setReason(r.getReason());

        if (isNew && r.getDueDate() != null && r.getDueDate().isBefore(LocalDate.now())) {
            throw new BusinessRuleException(
                    "dueDate " + r.getDueDate() + " is in the past; a new follow-up must be "
                    + "due today or later.");
        }
        if (isNew && e.getReminderAt().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("The reminder time cannot be in the past.");
        }

        String previousStatus = e.getStatus();
        String status = resolveStatus(r.getStatus(), previousStatus);
        e.setStatus(status);

        // Re-opening a follow-up that had been closed clears the stamp, so a
        // genuinely new reminder can be raised for it on the next run. This
        // applies ONLY to a CLOSED → OPEN transition: every other combination
        // keeps the stamp, so editing a follow-up that is still open cannot
        // re-arm it and let the scheduler notify the same customer twice.
        boolean reopened = isClosedStatus(previousStatus) && !isClosedStatus(status);
        if (reopened && e.getNotifiedAt() != null) {
            e.setNotifiedAt(null);
        }
    }

    private String resolveStatus(String requested, String current) {
        if (requested == null || requested.isBlank()) {
            return current != null ? current : STATUS_PENDING;
        }
        String normalized = requested.trim().toUpperCase();
        if (!ALL_STATUSES.contains(normalized)) {
            throw new BusinessRuleException(
                    "Unsupported follow-up status: '" + requested + "'. Allowed values are "
                    + ALL_STATUSES + ".");
        }
        return normalized;
    }

    private boolean isClosed(Followup e) {
        return isClosedStatus(e.getStatus());
    }

    /**
     * Whether a status means the follow-up is finished — COMPLETED or CANCELLED.
     * A null status is not closed, since a follow-up that has never been given a
     * status still needs doing.
     */
    private boolean isClosedStatus(String status) {
        return STATUS_COMPLETED.equalsIgnoreCase(status)
                || STATUS_CANCELLED.equalsIgnoreCase(status);
    }

    private FollowupResponseDTO toResponse(Followup e) {
        FollowupResponseDTO dto = new FollowupResponseDTO();
        dto.setId(e.getId());
        if (e.getCustomer() != null) {
            dto.setCustomerId(e.getCustomer().getId());
            dto.setCustomerName(e.getCustomer().getName());
            dto.setCustomerPhone(e.getCustomer().getPhone());
        }
        if (e.getJobCard() != null) {
            dto.setJobCardId(e.getJobCard().getId());
            dto.setJobCardNumber(e.getJobCard().getJobCardNumber());
        }
        if (e.getVehicle() != null) {
            dto.setVehicleId(e.getVehicle().getId());
            dto.setVehicleMake(e.getVehicle().getMake());
            dto.setVehicleModel(e.getVehicle().getModel());
            dto.setRegistrationNumber(e.getVehicle().getRegistrationNo());
        }
        if (e.getAssignedUser() != null) {
            dto.setAssignedUserId(e.getAssignedUser().getId());
            dto.setAssignedUserName(e.getAssignedUser().getFullName() != null
                    ? e.getAssignedUser().getFullName() : e.getAssignedUser().getUsername());
        }
        dto.setDueDate(e.getDueDate());
        dto.setReminderAt(e.getReminderAt() != null ? e.getReminderAt()
                : e.getDueDate() != null ? e.getDueDate().atTime(9, 0) : null);
        dto.setType(e.getType());
        dto.setChannel(e.getChannel());
        dto.setReason(e.getReason());
        dto.setStatus(e.getStatus());
        dto.setNotifiedAt(e.getNotifiedAt());
        dto.setClosed(isClosed(e));
        dto.setDue(!isClosed(e)
                && e.getDueDate() != null
                && !e.getDueDate().isAfter(LocalDate.now()));
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }

    private Followup findFollowup(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id));
    }

    private void createReminder(Followup followup) {
        FollowupReminder reminder = new FollowupReminder();
        reminder.setFollowup(followup);
        reminder.setReminderAt(followup.getReminderAt());
        reminder.setChannel(followup.getChannel());
        reminder.setStatus(isClosedStatus(followup.getStatus()) ? "CANCELLED" : "PENDING");
        reminderRepository.save(reminder);
    }

    private void cancelPendingReminders(Followup followup) {
        List<FollowupReminder> pending =
                reminderRepository.findByFollowupIdAndStatus(followup.getId(), "PENDING");
        pending.forEach(reminder -> reminder.setStatus("CANCELLED"));
        reminderRepository.saveAll(pending);
    }

    private FollowupReminderResponseDTO toReminderResponse(FollowupReminder reminder) {
        FollowupReminderResponseDTO dto = new FollowupReminderResponseDTO();
        dto.setId(reminder.getId());
        dto.setReminderAt(reminder.getReminderAt());
        dto.setChannel(reminder.getChannel());
        dto.setStatus(reminder.getStatus());
        dto.setSentAt(reminder.getSentAt());
        dto.setFailureReason(reminder.getFailureReason());
        dto.setCreatedAt(reminder.getCreatedAt());
        return dto;
    }

    private CommunicationResponseDTO toCommunicationResponse(Communication communication) {
        CommunicationResponseDTO dto = new CommunicationResponseDTO();
        dto.setId(communication.getId());
        dto.setCustomerId(communication.getCustomer().getId());
        dto.setCustomerName(communication.getCustomer().getName());
        dto.setCustomerPhone(communication.getCustomer().getPhone());
        if (communication.getJobCard() != null) {
            dto.setJobCardId(communication.getJobCard().getId());
            dto.setJobCardNumber(communication.getJobCard().getJobCardNumber());
        }
        dto.setChannel(communication.getChannel());
        dto.setDirection(communication.getDirection());
        dto.setSubject(communication.getSubject());
        dto.setMessage(communication.getMessage());
        dto.setSentAt(communication.getSentAt());
        dto.setDeliveryStatus(communication.getDeliveryStatus());
        dto.setCreatedAt(communication.getCreatedAt());
        dto.setUpdatedAt(communication.getUpdatedAt());
        return dto;
    }

    private String normalizeFilter(String value) {
        return value == null || value.isBlank() ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
