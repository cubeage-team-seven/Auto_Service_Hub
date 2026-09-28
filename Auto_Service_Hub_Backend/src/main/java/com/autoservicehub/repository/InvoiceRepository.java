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

/**
 * Spring Data JPA repository for Invoice. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.invoiceDate = CURRENT_DATE")
    BigDecimal sumTodayRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.invoiceDate BETWEEN :from AND :to")
    BigDecimal sumTotalByInvoiceDateBetween(LocalDate from, LocalDate to);

    long countByInvoiceDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i JOIN i.jobCard jc " +
            "WHERE jc.status = :status AND jc.assignedDate BETWEEN :from AND :to " +
            "AND (:mechanicId IS NULL OR jc.mechanic.id = :mechanicId)")
    BigDecimal sumTotalByMechanicAndJobStatus(@Param("mechanicId") Long mechanicId,
                                              @Param("status") String status,
                                              @Param("from") LocalDateTime from,
                                              @Param("to") LocalDateTime to);
}
