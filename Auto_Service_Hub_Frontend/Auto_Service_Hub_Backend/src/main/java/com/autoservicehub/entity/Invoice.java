package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Maps to the 'invoices' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "invoices")
public class Invoice extends BaseEntity {

    @Column(name = "subtotal")
    private BigDecimal subtotal;
    @Column(name = "discount")
    private BigDecimal discount;
    @Column(name = "gst")
    private BigDecimal gst;
    @Column(name = "total")
    private BigDecimal total;
    @Column(name = "status")
    private String status;
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
}
