package com.autoservicehub.repository;

import com.autoservicehub.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for Invoice.
 * Extends JpaSpecificationExecutor for dynamic filters (SRS 9, 17).
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {

    // ── Existing dashboard / report queries ───────────────────────────────
    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.invoiceDate = CURRENT_DATE")
    BigDecimal sumTodayRevenue();

    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.invoiceDate BETWEEN :from AND :to")
    BigDecimal sumTotalByInvoiceDateBetween(LocalDate from, LocalDate to);

    long countByInvoiceDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i JOIN i.jobCard jc " +
           "WHERE jc.status = :status AND jc.assignedDate BETWEEN :from AND :to " +
           "AND (:mechanicId IS NULL OR jc.mechanic.id = :mechanicId)")
    BigDecimal sumTotalByMechanicAndJobStatus(@Param("mechanicId") Long mechanicId,
                                              @Param("status")     String status,
                                              @Param("from")       LocalDateTime from,
                                              @Param("to")         LocalDateTime to);

    // ── FR-CRM-7: All invoices for a customer via jobCard FK chain ────────
    @Query("SELECT i FROM Invoice i JOIN i.jobCard jc " +
           "WHERE jc.customer.id = :customerId ORDER BY i.invoiceDate DESC")
    List<Invoice> findByCustomerId(@Param("customerId") Long customerId);

    // ── FR-CRM-7: Total spend for a customer ──────────────────────────────
    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i JOIN i.jobCard jc " +
           "WHERE jc.customer.id = :customerId")
    BigDecimal sumTotalByCustomerId(@Param("customerId") Long customerId);

    // ── FR-CRM-7: Open (unpaid) invoice count for a customer ─────────────
    @Query("SELECT COUNT(i) FROM Invoice i JOIN i.jobCard jc " +
           "WHERE jc.customer.id = :customerId AND i.status <> 'PAID'")
    long countOpenByCustomerId(@Param("customerId") Long customerId);

    // ── FR-CRM-7: Open invoice total amount for a customer ───────────────
    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i JOIN i.jobCard jc " +
           "WHERE jc.customer.id = :customerId AND i.status <> 'PAID'")
    BigDecimal sumOpenTotalByCustomerId(@Param("customerId") Long customerId);
}
