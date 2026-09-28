package com.autoservicehub.service.impl;

import com.autoservicehub.dto.CustomerGrowthReportDTO;
import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.dto.RevenueReportDTO;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.repository.AppointmentRepository;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.repository.InvoiceRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.repository.PartRepository;
import com.autoservicehub.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final JobCardRepository jobCardRepository;
    private final InvoiceRepository invoiceRepository;
    private final PartRepository partRepository;
    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;

    @Override
    public DashboardSummaryDTO getDashboardSummary() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);

        long todaysJobs    = jobCardRepository.countByAssignedDateBetween(startOfDay, endOfDay);
        long completedJobs = jobCardRepository.countByStatus("DELIVERED");
        long pendingJobs   = jobCardRepository.countByStatus("RECEIVED")
                           + jobCardRepository.countByStatus("INSPECTION")
                           + jobCardRepository.countByStatus("IN_REPAIR")
                           + jobCardRepository.countByStatus("QUALITY_CHECK");
        long lowStockParts = partRepository.countByStockQtyLessThanEqualAndMinStockGreaterThan(0, 0);
        long upcomingAppts = appointmentRepository.countByAppointmentAtBetween(
                LocalDateTime.now(), LocalDateTime.now().plusDays(7));

        return new DashboardSummaryDTO(
                todaysJobs, completedJobs, pendingJobs,
                invoiceRepository.sumTodayRevenue(),
                lowStockParts, upcomingAppts);
    }

    @Override
    public RevenueReportDTO getRevenueReport(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new BusinessRuleException("Revenue report requires both from and to dates.");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("Revenue report date range is invalid: from date cannot be after to date.");
        }

        BigDecimal totalRevenue = invoiceRepository.sumTotalByInvoiceDateBetween(from, to);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long invoiceCount = invoiceRepository.countByInvoiceDateBetween(from, to);
        BigDecimal averageInvoiceValue = invoiceCount == 0
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(invoiceCount), 2, RoundingMode.HALF_UP);

        return new RevenueReportDTO(from, to, totalRevenue, invoiceCount, averageInvoiceValue);
    }

    @Override
    public Object getMechanicPerformanceReport(LocalDate from, LocalDate to, Long mechanicId) {
        return null;
    }

    @Override
    public Object getPartsUsageReport(LocalDate from, LocalDate to) {
        return null;
    }

    @Override
    public CustomerGrowthReportDTO getCustomerGrowthReport(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new BusinessRuleException("Customer growth report requires both from and to dates.");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("Customer growth report date range is invalid: from date cannot be after to date.");
        }

        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay();

        long newCustomerCount = customerRepository.countByCreatedAtBetween(fromDateTime, toDateTime);
        return new CustomerGrowthReportDTO(from, to, newCustomerCount);
    }

    @Override
    public Object getProfitAnalysisReport(LocalDate from, LocalDate to) {
        return null;
    }
}
