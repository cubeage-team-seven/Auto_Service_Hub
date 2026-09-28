package com.autoservicehub.controller;

import com.autoservicehub.ai.AiFeatureType;
import com.autoservicehub.ai.AiOrchestrationService;
import com.autoservicehub.ai.AiRequest;
import com.autoservicehub.ai.AiResult;
import com.autoservicehub.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AI Center endpoints (SRS 5, 9, 10 - AI Center screen, 11.3 - AI Flow).
 * Every response must be reviewed/confirmed by a user before it changes a
 * job card, invoice, or stock record (BR-09).
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiOrchestrationService aiOrchestrationService;

    @PostMapping("/diagnosis")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC', 'INVENTORY_MANAGER')")
    public ApiResponse<AiResult> diagnosis(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.VEHICLE_DIAGNOSIS);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/cost-estimate")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'BILLING_USER')")
    public ApiResponse<AiResult> costEstimate(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.REPAIR_COST_ESTIMATE);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC', 'INVENTORY_MANAGER')")
    public ApiResponse<AiResult> maintenance(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MAINTENANCE_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/damage")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC')")
    public ApiResponse<AiResult> damage(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.DAMAGE_DETECTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/mechanic-assignment")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    public ApiResponse<AiResult> mechanicAssignment(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MECHANIC_ASSIGNMENT);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/parts-prediction")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    public ApiResponse<AiResult> partsPrediction(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.PARTS_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }
}
