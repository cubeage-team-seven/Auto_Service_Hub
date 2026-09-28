package com.autoservicehub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class RevenueReportDTO {
    private LocalDate from;
    private LocalDate to;
    private BigDecimal totalRevenue;
    private long invoiceCount;
    private BigDecimal averageInvoiceValue;
}
