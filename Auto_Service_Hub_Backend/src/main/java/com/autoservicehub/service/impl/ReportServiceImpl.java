package com.autoservicehub.service.impl;

import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.service.ReportService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Aggregation queries should be implemented against job_cards, invoices,
 * payments, parts and customers (SRS 8.2) once the ERD is finalized.
 */
@Service
public class ReportServiceImpl implements ReportService {

    @Override
    public DashboardSummaryDTO getDashboardSummary() {
        // TODO: replace placeholder counts with real aggregation queries
        return new DashboardSummaryDTO(0, 0, 0, BigDecimal.ZERO, 0, 0);
    }

    @Override
    public Object getRevenueReport(LocalDate from, LocalDate to) {
        return null; // TODO
    }

    @Override
    public Object getMechanicPerformanceReport(LocalDate from, LocalDate to, Long mechanicId) {
        return null; // TODO
    }

    @Override
    public Object getPartsUsageReport(LocalDate from, LocalDate to) {
        return null; // TODO
    }

    @Override
    public Object getCustomerGrowthReport(LocalDate from, LocalDate to) {
        return null; // TODO
    }

    @Override
    public Object getProfitAnalysisReport(LocalDate from, LocalDate to) {
        return null; // TODO
    }
}
