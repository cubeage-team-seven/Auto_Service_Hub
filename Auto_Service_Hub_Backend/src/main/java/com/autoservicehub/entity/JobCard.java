package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "job_cards")
public class JobCard extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mechanic_id")
    private Mechanic mechanic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "job_card_number")
    private String jobCardNumber;
    @Column(name = "service_type")
    private String serviceType;
    @Column(name = "complaint", columnDefinition = "TEXT")
    private String complaint;
    @Column(name = "technician_notes", columnDefinition = "TEXT")
    private String technicianNotes;
    @Column(name = "odometer_reading")
    private Integer odometerReading;
    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;
    @Column(name = "estimated_cost")
    private BigDecimal estimatedCost;
    @Column(name = "status")
    private String status;
    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
}
