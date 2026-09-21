package com.autoservicehub.service;

import com.autoservicehub.dto.DashboardSummaryDTO;
import java.time.LocalDate;

/**
 * Dashboard & Reports (SRS 4.11, 17). Filters by date range, mechanic, vehicle,
 * service and status per FR-REP-7; export handled at the controller layer (FR-REP-8).
 */
public interface ReportService {
    DashboardSummaryDTO getDashboardSummary();
    Object getRevenueReport(LocalDate from, LocalDate to);
    Object getMechanicPerformanceReport(LocalDate from, LocalDate to, Long mechanicId);
    Object getPartsUsageReport(LocalDate from, LocalDate to);
    Object getCustomerGrowthReport(LocalDate from, LocalDate to);
    Object getProfitAnalysisReport(LocalDate from, LocalDate to);
}
