package com.autoservicehub.controller;

import com.autoservicehub.ai.AiFeatureType;
import com.autoservicehub.ai.AiOrchestrationService;
import com.autoservicehub.ai.AiRequest;
import com.autoservicehub.ai.AiResult;
import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.DiagnosisRequestDTO;
import com.autoservicehub.dto.DiagnosisResponseDTO;
import com.autoservicehub.dto.RepairCostEstimationRequestDTO;
import com.autoservicehub.dto.RepairCostEstimationResponseDTO;
import com.autoservicehub.service.RepairCostEstimationService;
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
 * <p>Diagnosis (FR-AI-01..04) and Repair Cost Estimation (FR-AI-05..08) are
 * fully implemented, each with domain validation, database-grounded context
 * enrichment, a typed response and an enforced human-review disclaimer.
 * The remaining AI feature endpoints retain their original stub behaviour until
 * they are individually implemented.
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Center", description = "AI-assisted vehicle operations — outputs are advisory and require human confirmation (SRS BR-09)")
public class AiController {

    private final AiOrchestrationService        aiOrchestrationService;
    private final VehicleDiagnosisService       vehicleDiagnosisService;
    private final RepairCostEstimationService   repairCostEstimationService;

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

    // ── FR-AI-05..08: Repair Cost Estimation ─────────────────────────────

    /**
     * POST /api/v1/ai/repair-cost-estimation
     *
     * <p>Produces an AI-assisted estimate of the cost of a repair. The request
     * deliberately accepts no client-supplied price or total — the figure is
     * produced by the AI provider and is advisory only.
     *
     * <p>Vehicle, job card and parts context is read from the database when
     * supplied. The response reports which inputs were missing rather than
     * filling the gaps in.
     *
     * <p>The result is NOT a quotation and NOT a guaranteed price. It must be
     * reviewed by a service advisor or manager and agreed with the customer
     * before any work is authorised (SRS BR-09, FR-AI-08).
     */
    @PostMapping("/repair-cost-estimation")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'SERVICE_ADVISOR', 'BILLING_USER')")
    @Operation(
        summary = "AI Repair Cost Estimation",
        description = "Estimates the cost of a repair using AI, grounded in vehicle, job card and parts " +
                      "data from the database. Accepts no client-supplied totals. The output is an " +
                      "APPROXIMATION, not a quotation or guaranteed price, and MUST be reviewed by a " +
                      "service advisor or manager and agreed with the customer before work is authorised. " +
                      "When the AI provider is unavailable no figure is returned and a manual estimate " +
                      "must be prepared."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Estimate produced (or provider unavailable — see providerUnavailable flag)",
            content = @Content(schema = @Schema(implementation = RepairCostEstimationResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — serviceDescription missing or too short"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Authentication required"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Vehicle, job card or part not found (when the corresponding id was supplied)")
    })
    public ApiResponse<RepairCostEstimationResponseDTO> repairCostEstimation(
            @Valid @RequestBody RepairCostEstimationRequestDTO request) {
        return ApiResponse.ok(repairCostEstimationService.estimate(request));
    }

    // ── Remaining AI stubs (not yet implemented — FR-AI-09..24) ───────────
    // These endpoints retain their original structure pending individual
    // implementation tasks.  They are NOT modified by this change.

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
