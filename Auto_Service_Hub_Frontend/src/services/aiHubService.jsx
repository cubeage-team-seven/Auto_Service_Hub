import { fetchWithAuth } from "./api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api/v1" : "http://localhost:8081/api/v1")
).replace(/\/+$/, "");

/**
 * AI Hub integration calls for the Garage Owner AI panel.
 *
 * Every endpoint here is ADVISORY ONLY (SRS BR-09). The backend never creates
 * or modifies a job card, estimate or stock record on the strength of an AI
 * result — none of these calls perform an operational write. The mechanic
 * assignment endpoint returns a RECOMMENDATION ONLY; the actual assignment is
 * done through the job card update endpoint by the caller after human review.
 *
 * Response shapes (all wrapped in ApiResponse<T>):
 *   maintenance-prediction -> MaintenancePredictionResponseDTO
 *   spare-parts-prediction -> SparePartsPredictionResponseDTO
 *   mechanic-assignment    -> MechanicAssignmentResponseDTO
 *
 * Failures are returned by GlobalExceptionHandler as a bare ApiErrorResponse
 * ({ code, message, correlationId, timestamp }) — same `message` field, so one
 * read path handles both shapes.
 */
async function requestAiData(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  let response;

  try {
    response = await fetchWithAuth(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(`Unable to reach the AI API at ${url}.${detail}`);
  }

  let body = null;
  try {
    body = response.status === 204 ? null : await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(
        `AI API request failed (${response.status} ${response.statusText}).`
      );
    }
    throw new Error(`AI API returned invalid JSON (${response.status}).`);
  }

  if (!response.ok) {
    const message =
      body?.message ||
      `AI API request failed (${response.status} ${response.statusText}).`;

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `${message} Sign in with an account that is allowed to request this AI feature.`
      );
    }

    if (body?.correlationId) {
      throw new Error(`${message} (Reference: ${body.correlationId})`);
    }

    throw new Error(message);
  }

  if (body && body.success === false) {
    throw new Error(body.message || "AI API returned an unsuccessful response.");
  }

  return body?.data ?? null;
}

function positiveId(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

/**
 * POST /api/v1/ai/maintenance-prediction
 *
 * vehicleId is required by the backend (FR-AI-09). currentMileage and notes
 * are optional advisory context. Returns the MaintenancePredictionResponseDTO:
 *   { vehicleId, summary, predictedItems[], confidence, humanReviewRequired,
 *     providerUnavailable, dataLimitations[], serviceHistorySummary,
 *     disclaimer, generatedAt }
 */
export function getMaintenancePrediction({ vehicleId, currentMileage, notes } = {}) {
  const id = positiveId(vehicleId);
  if (id == null) {
    throw new Error("Select a vehicle before requesting an AI maintenance prediction.");
  }

  const payload = { vehicleId: id };
  const mileage = positiveId(currentMileage);
  if (mileage != null) payload.currentMileage = mileage;
  const trimmedNotes = typeof notes === "string" ? notes.trim() : "";
  if (trimmedNotes) payload.notes = trimmedNotes;

  return requestAiData("/ai/maintenance-prediction", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/v1/ai/spare-parts-prediction
 *
 * serviceDescription is required (FR-AI-21). jobCardId, vehicleId, partIds and
 * additionalNotes are optional grounding context. Returns the
 * SparePartsPredictionResponseDTO:
 *   { jobCardId, vehicleId, summary, predictedParts[], confidence,
 *     humanReviewRequired, inventoryModified (always false), providerUnavailable,
 *     dataLimitations[], inventorySnapshot, disclaimer, generatedAt }
 */
export function getSparePartsPrediction({
  serviceDescription,
  jobCardId,
  vehicleId,
  partIds,
  additionalNotes,
} = {}) {
  const trimmedDescription =
    typeof serviceDescription === "string" ? serviceDescription.trim() : "";
  if (!trimmedDescription) {
    throw new Error("Describe the repair before requesting an AI spare parts prediction.");
  }

  const payload = { serviceDescription: trimmedDescription };
  const jobId = positiveId(jobCardId);
  if (jobId != null) payload.jobCardId = jobId;
  const vehicle = positiveId(vehicleId);
  if (vehicle != null) payload.vehicleId = vehicle;
  if (Array.isArray(partIds)) {
    const validIds = partIds.map(positiveId).filter((id) => id != null);
    if (validIds.length) payload.partIds = validIds;
  }
  const trimmedNotes = typeof additionalNotes === "string" ? additionalNotes.trim() : "";
  if (trimmedNotes) payload.additionalNotes = trimmedNotes;

  return requestAiData("/ai/spare-parts-prediction", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/v1/ai/mechanic-assignment
 *
 * jobCardId is required (FR-AI-17). candidateMechanicIds narrows the candidate
 * pool the provider may consider; additionalContext is free-form advisory
 * input. Returns a RECOMMENDATION ONLY (MechanicAssignmentResponseDTO):
 *   { jobCardId, recommendedMechanicId, recommendedMechanicEmployeeCode,
 *     recommendedMechanicName, rationale, confidence, humanReviewRequired,
 *     assignmentPersisted (always false), providerUnavailable,
 *     dataLimitations[], candidatePoolSummary, disclaimer, generatedAt }
 */
export function recommendMechanic({ jobCardId, candidateMechanicIds, additionalContext } = {}) {
  const id = positiveId(jobCardId);
  if (id == null) {
    throw new Error("Select a job card before requesting an AI mechanic recommendation.");
  }

  const payload = { jobCardId: id };
  if (Array.isArray(candidateMechanicIds)) {
    const validIds = candidateMechanicIds
      .map(positiveId)
      .filter((candidateId) => candidateId != null);
    if (validIds.length) payload.candidateMechanicIds = validIds;
  }
  const trimmedContext =
    typeof additionalContext === "string" ? additionalContext.trim() : "";
  if (trimmedContext) payload.additionalContext = trimmedContext;

  return requestAiData("/ai/mechanic-assignment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

