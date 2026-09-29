package com.autoservicehub.repository;

import com.autoservicehub.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for Appointment.
 * Extends JpaSpecificationExecutor for dynamic filters (SRS 9, 17).
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {

    // ── Existing dashboard query ───────────────────────────────────────────
    long countByAppointmentAtBetween(LocalDateTime from, LocalDateTime to);

    // ── FR-CRM-7: All appointments for a customer, newest first ──────────
    List<Appointment> findByCustomerIdOrderByAppointmentAtDesc(Long customerId);
}
