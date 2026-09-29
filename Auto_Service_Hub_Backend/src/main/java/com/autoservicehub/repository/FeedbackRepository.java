package com.autoservicehub.repository;

import com.autoservicehub.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Feedback (SRS FR-CRM-5).
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long>, JpaSpecificationExecutor<Feedback> {

    /** Paged feedback for a customer, newest first. */
    Page<Feedback> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    /** Full list for Customer 360 (no pagination needed for typical feedback counts). */
    List<Feedback> findTop10ByCustomerIdOrderByCreatedAtDesc(Long customerId);

    /** Feedback for a specific job card. */
    Optional<Feedback> findByJobCardId(Long jobCardId);

    /** Average rating for a customer (null if no feedback). */
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.customer.id = :customerId")
    Double findAverageRatingByCustomerId(@Param("customerId") Long customerId);
}
