package com.autoservicehub.repository;

import com.autoservicehub.entity.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for JobCard.
 * Extends JpaSpecificationExecutor for dynamic filters (SRS 9, 17).
 */
@Repository
public interface JobCardRepository extends JpaRepository<JobCard, Long>, JpaSpecificationExecutor<JobCard> {

    // ── Existing dashboard/report queries ──────────────────────────────────
    long countByStatus(String status);
    long countByAssignedDateBetween(LocalDateTime from, LocalDateTime to);
    long countByStatusAndAssignedDateBetween(String status, LocalDateTime from, LocalDateTime to);
    long countByMechanicIdAndStatusAndAssignedDateBetween(Long mechanicId, String status,
                                                          LocalDateTime from, LocalDateTime to);

    // ── FR-CRM-3: Chronological service history per customer ──────────────
    List<JobCard> findByCustomerIdOrderByAssignedDateDesc(Long customerId);

    // ── FR-CRM-3: Chronological service history per vehicle ───────────────
    List<JobCard> findByVehicleIdOrderByAssignedDateDesc(Long vehicleId);

    // ── FR-CRM-7: Most recent completed job for a customer (last-service date)
    @Query("SELECT j FROM JobCard j WHERE j.customer.id = :customerId " +
           "AND j.status = 'DELIVERED' ORDER BY j.completedDate DESC")
    List<JobCard> findLastDeliveredByCustomerId(@Param("customerId") Long customerId);

    // ── FR-CRM-6: Last service date subquery support ──────────────────────
    @Query("SELECT MAX(j.completedDate) FROM JobCard j " +
           "WHERE j.customer.id = :customerId AND j.status = 'DELIVERED'")
    Optional<LocalDateTime> findLastServiceDateByCustomerId(@Param("customerId") Long customerId);
}
