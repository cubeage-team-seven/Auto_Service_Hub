package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Reports & Analytics (SRS 9 - Reports API group, 17).
 */
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ApiResponse<DashboardSummaryDTO> dashboard() {
        return ApiResponse.ok(reportService.getDashboardSummary());
    }

    @GetMapping("/revenue")
    public ApiResponse<Object> revenue(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.ok(reportService.getRevenueReport(from, to));
    }

    @GetMapping("/mechanic-performance")
    public ApiResponse<Object> mechanicPerformance(@RequestParam LocalDate from, @RequestParam LocalDate to,
                                                     @RequestParam(required = false) Long mechanicId) {
        return ApiResponse.ok(reportService.getMechanicPerformanceReport(from, to, mechanicId));
    }

    @GetMapping("/parts-usage")
    public ApiResponse<Object> partsUsage(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ApiResponse.ok(reportService.getPartsUsageReport(from, to));
    }

    @GetMapping("/customer-growth")
    public ApiResponse<Object> customerGrowth(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ApiResponse.ok(reportService.getCustomerGrowthReport(from, to));
    }

    @GetMapping("/profit-analysis")
    public ApiResponse<Object> profitAnalysis(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ApiResponse.ok(reportService.getProfitAnalysisReport(from, to));
    }
}
