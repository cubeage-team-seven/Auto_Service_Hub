package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.DashboardSummaryDTO;
import com.autoservicehub.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryDTO> summary() {
        return ApiResponse.ok(reportService.getDashboardSummary());
    }
}
