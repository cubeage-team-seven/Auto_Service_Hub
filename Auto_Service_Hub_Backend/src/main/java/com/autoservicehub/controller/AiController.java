package com.autoservicehub.controller;

import com.autoservicehub.ai.AiFeatureType;
import com.autoservicehub.ai.AiOrchestrationService;
import com.autoservicehub.ai.AiRequest;
import com.autoservicehub.ai.AiResult;
import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.DiagnosisRequestDTO;
import com.autoservicehub.dto.DiagnosisResponseDTO;
import com.autoservicehub.service.VehicleDiagnosisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AI Center endpoints (SRS 5, 9, 10 - AI Center screen, 11.3 - AI Flow).
 *
 * <p>Every response must be reviewed/confirmed by a user before it changes a
 * job card, invoice, or stock record (BR-09).
 *
 * <p>Diagnosis (FR-AI-01..04) is fully implemented with domain validation,
 * vehicle context enrichment, and structured response.
 * All other AI feature endpoints retain their original stub behaviour until
 * they are individually implemented.
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Center", description = "AI-assisted vehicle operations — outputs are advisory and require human confirmation (SRS BR-09)")
public class AiController {

    private final AiOrchestrationService  aiOrchestrationService;
    private final VehicleDiagnosisService vehicleDiagnosisService;

    // ── FR-AI-01..04: Vehicle Diagnosis ───────────────────────────────────

    /**
     * POST /api/v1/ai/diagnosis
     *
     * <p>Performs AI-assisted vehicle diagnosis based on reported symptoms,
     * optional inspection findings, and optional vehicle database context.
     * The result is always advisory — a qualified technician must review and
     * confirm before any repair action is taken (SRS BR-09, FR-AI-04).
     */
    @PostMapping("/diagnosis")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC', 'INVENTORY_MANAGER')")
    @Operation(
        summary = "AI Vehicle Diagnosis",
        description = "Provides an AI-assisted diagnosis recommendation based on symptoms, " +
                      "inspection findings and (optionally) vehicle data from the database. " +
                      "Output is ADVISORY ONLY — human confirmation required before any repair action."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Diagnosis completed (or provider unavailable — see providerUnavailable flag)",
            content = @Content(schema = @Schema(implementation = DiagnosisResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — symptoms missing or too short"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Vehicle not found (when vehicleId supplied)")
    })
    public ApiResponse<DiagnosisResponseDTO> diagnosis(
            @Valid @RequestBody DiagnosisRequestDTO request) {
        return ApiResponse.ok(vehicleDiagnosisService.diagnose(request));
    }

    // ── Remaining AI stubs (not yet implemented — FR-AI-05..24) ───────────
    // These endpoints retain their original structure pending individual
    // implementation tasks.  They are NOT modified by this change.

    @PostMapping("/cost-estimate")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'BILLING_USER')")
    @Operation(summary = "AI Repair Cost Estimate (stub)", description = "Not yet fully implemented.")
    public ApiResponse<AiResult> costEstimate(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.REPAIR_COST_ESTIMATE);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC', 'INVENTORY_MANAGER')")
    @Operation(summary = "AI Maintenance Prediction (stub)", description = "Not yet fully implemented.")
    public ApiResponse<AiResult> maintenance(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MAINTENANCE_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/damage")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'MECHANIC')")
    @Operation(summary = "AI Damage Detection (stub)", description = "Not yet fully implemented.")
    public ApiResponse<AiResult> damage(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.DAMAGE_DETECTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/mechanic-assignment")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR')")
    @Operation(summary = "AI Mechanic Assignment (stub)", description = "Not yet fully implemented.")
    public ApiResponse<AiResult> mechanicAssignment(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.MECHANIC_ASSIGNMENT);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }

    @PostMapping("/parts-prediction")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    @Operation(summary = "AI Parts Prediction (stub)", description = "Not yet fully implemented.")
    public ApiResponse<AiResult> partsPrediction(@RequestBody AiRequest request) {
        request.setFeatureType(AiFeatureType.PARTS_PREDICTION);
        return ApiResponse.ok(aiOrchestrationService.process(request));
    }
}
