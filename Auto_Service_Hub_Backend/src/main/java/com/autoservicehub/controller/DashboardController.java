package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.repository.AppointmentRepository;
import com.autoservicehub.repository.InvoiceRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final JobCardRepository jobCardRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PartRepository partRepository;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryDTO> summary() {
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

        DashboardSummaryDTO dto = new DashboardSummaryDTO(
                todaysJobs,
                completedJobs,
                pendingJobs,
                invoiceRepository.sumTodayRevenue(),
                lowStockParts,
                upcomingAppts
        );
        return ApiResponse.ok(dto);
    }
}
