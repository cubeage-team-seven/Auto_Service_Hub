package com.autoservicehub.controller;

import com.autoservicehub.ai.AiFeatureType;
import com.autoservicehub.ai.AiOrchestrationService;
import com.autoservicehub.ai.AiRequest;
import com.autoservicehub.ai.AiResult;
import com.autoservicehub.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
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
    public ApiResponse<AiResult> diagnosis(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.VEHICLE_DIAGNOSIS);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/cost-estimate")
    public ApiResponse<AiResult> costEstimate(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.REPAIR_COST_ESTIMATE);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/maintenance")
    public ApiResponse<AiResult> maintenance(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MAINTENANCE_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/damage")
    public ApiResponse<AiResult> damage(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.DAMAGE_DETECTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/mechanic-assignment")
    public ApiResponse<AiResult> mechanicAssignment(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MECHANIC_ASSIGNMENT);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/parts-prediction")
    public ApiResponse<AiResult> partsPrediction(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.PARTS_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }
}
