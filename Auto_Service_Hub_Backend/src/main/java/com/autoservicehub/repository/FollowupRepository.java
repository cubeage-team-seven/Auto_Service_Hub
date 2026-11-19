package com.autoservicehub.repository;

import com.autoservicehub.entity.Followup;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA repository for Followup. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface FollowupRepository extends JpaRepository<Followup, Long>, JpaSpecificationExecutor<Followup> {

    @Modifying
    @Query("UPDATE Followup f SET f.assignedUser = null WHERE f.assignedUser.id = :userId")
    int clearAssignedUserReferences(@Param("userId") Long userId);

    /** Follow-ups in an open state (not COMPLETED, not CANCELLED). */
    List<Followup> findByStatusInOrderByDueDateAscIdAsc(List<String> statuses);
    Page<Followup> findByStatusIn(List<String> statuses, Pageable pageable);
    Page<Followup> findByStatusInOrderByDueDateAscIdAsc(List<String> statuses, Pageable pageable);

    /** Open follow-ups that have come due on or before {@code asOf}, oldest first. */
    List<Followup> findByStatusInAndDueDateLessThanEqualOrderByIdAsc(
            List<String> statuses, LocalDate asOf);
    Page<Followup> findByStatusInAndDueDateLessThanEqual(
            List<String> statuses, LocalDate asOf, Pageable pageable);
    Page<Followup> findByStatusInAndDueDateLessThanEqualOrderByDueDateAscIdAsc(
            List<String> statuses, LocalDate asOf, Pageable pageable);

    /**
     * Open follow-ups due on or before {@code asOf} that have not been
     * notified yet. {@code notifiedAt IS NULL} is what keeps the scheduled
     * processing idempotent.
     */
    List<Followup> findByStatusInAndDueDateLessThanEqualAndNotifiedAtIsNullOrderByIdAsc(
            List<String> statuses, LocalDate asOf);

    List<Followup> findByCustomerIdOrderByDueDateDesc(Long customerId);
    Page<Followup> findByCustomerId(Long customerId, Pageable pageable);
    Page<Followup> findByCustomerIdOrderByDueDateDesc(Long customerId, Pageable pageable);
}
