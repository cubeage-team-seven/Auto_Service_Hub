package com.autoservicehub.repository;

import com.autoservicehub.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Spring Data JPA repository for Customer.
 * Extends JpaSpecificationExecutor for dynamic filters (SRS 9, 17).
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    // ── Existing report query ─────────────────────────────────────────────
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    // ── FR-CRM-1: Check for duplicate phone before create/update ─────────
    boolean existsByPhoneAndIdNot(String phone, Long id);
    boolean existsByPhone(String phone);

    // ── FR-CRM-6: Server-side search across name, phone, email ───────────
    @Query("SELECT c FROM Customer c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:q IS NULL OR :q = '' OR " +
           "  LOWER(c.name)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "  c.phone        LIKE CONCAT('%', :q, '%') OR " +
           "  LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Customer> search(@Param("q") String q,
                          @Param("status") String status,
                          Pageable pageable);

    // ── FR-CRM-6: Search by vehicle registration (joins vehicles table) ───
    @Query("SELECT DISTINCT c FROM Customer c JOIN Vehicle v ON v.customer.id = c.id " +
           "WHERE LOWER(v.registrationNo) LIKE LOWER(CONCAT('%', :regNo, '%'))")
    Page<Customer> searchByVehicleRegistration(@Param("regNo") String regNo, Pageable pageable);
}
