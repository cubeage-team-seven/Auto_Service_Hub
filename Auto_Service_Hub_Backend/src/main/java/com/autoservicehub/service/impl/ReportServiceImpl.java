package com.autoservicehub.service.impl;

import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.repository.AppointmentRepository;
import com.autoservicehub.repository.InvoiceRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.repository.PartRepository;
import com.autoservicehub.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final JobCardRepository jobCardRepository;
    private final InvoiceRepository invoiceRepository;
    private final PartRepository partRepository;
    private final AppointmentRepository appointmentRepository;

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
    public Object getRevenueReport(LocalDate from, LocalDate to) {
        return null;
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
    public Object getCustomerGrowthReport(LocalDate from, LocalDate to) {
        return null;
    }

    @Override
    public Object getProfitAnalysisReport(LocalDate from, LocalDate to) {
        return null;
    }
}
