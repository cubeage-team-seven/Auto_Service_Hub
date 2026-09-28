package com.autoservicehub.repository;

import com.autoservicehub.entity.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Spring Data JPA repository for JobCard. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface JobCardRepository extends JpaRepository<JobCard, Long>, JpaSpecificationExecutor<JobCard> {
    long countByStatus(String status);
    long countByAssignedDateBetween(LocalDateTime from, LocalDateTime to);
    long countByStatusAndAssignedDateBetween(String status, LocalDateTime from, LocalDateTime to);
    long countByMechanicIdAndStatusAndAssignedDateBetween(Long mechanicId, String status, LocalDateTime from, LocalDateTime to);
}
