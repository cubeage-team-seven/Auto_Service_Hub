import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { diagnoseVehicle } from "../../services/aiService";
import {
  getMaintenancePrediction,
  recommendMechanic,
} from "../../services/aiHubService";
import { getVehicles } from "../../services/vehicleService";
import {
  getJobCard,
  getJobCards,
  updateJobCard,
} from "../../services/jobCardService";
import { getMechanics } from "../../services/mechanicService";
import { getLowStockParts } from "../../services/inventoryService";
import { createCommunication } from "../../services/communicationService";
import { createPurchase } from "../../services/purchaseService";

import "./GarageOwnerAIHub.css";


/* =========================================================
   CARD IDENTIFIERS
   Stable ids - never the array index - so each connected card
   can be matched, refreshed and dismissed independently.
   ========================================================= */

const BATTERY_CARD_ID = "battery-diagnosis";
const TYRE_CARD_ID = "tyre-replacement";
const LOW_STOCK_CARD_ID = "low-stock";
const MECHANIC_ASSIGNMENT_CARD_ID = "mechanic-assignment";

/* Persistent dismissal is used for the Tyre and Low Stock cards only
   (the plan deliberately keeps the other dismissals in-memory). */
const TYRE_DISMISS_KEY = "aiHub.tyre.dismissed";
const LOW_STOCK_DISMISS_KEY = "aiHub.lowStock.dismissed";


/* =========================================================
   DEFAULT REPORTED SYMPTOM
   REQUEST INPUT (what the garage is reporting), pre-filled on
   the battery card and editable before the diagnosis is run.
   ========================================================= */

const DEFAULT_BATTERY_SYMPTOMS =
  "Vehicle cranks slowly on start and struggles to turn over, especially in the morning.";


/* =========================================================
   ALLOWED ROLES
   Mirrors the @PreAuthorize guards on the backend endpoints the
   cards call. Used only to explain a blocked request up front -
   the backend remains the authority, and its own 403 is surfaced
   verbatim when a request is sent anyway.
   ========================================================= */

const DIAGNOSIS_ALLOWED_ROLES = [
  "OWNER", "MANAGER", "SERVICE_ADVISOR", "MECHANIC", "INVENTORY_MANAGER",
  // Stored spelling of the garage owner. The server authorises it as
  // ROLE_OWNER; authService collapses it to OWNER on the JWT, but it is
  // listed here as well so the block check survives an un-collapsed token.
  "GARAGE_OWNER",
];

const MAINTENANCE_ALLOWED_ROLES = [
  "OWNER", "GARAGE_OWNER", "MANAGER", "SERVICE_ADVISOR", "MECHANIC",
];

const MECHANIC_ASSIGNMENT_ALLOWED_ROLES = [
  "OWNER", "GARAGE_OWNER", "MANAGER", "SERVICE_ADVISOR",
];

const LOW_STOCK_READ_ALLOWED_ROLES = [
  "OWNER", "GARAGE_OWNER", "MANAGER", "SERVICE_ADVISOR", "MECHANIC", "INVENTORY_MANAGER", "BILLING_USER",
];

const PURCHASE_WRITE_ALLOWED_ROLES = [
  "OWNER", "GARAGE_OWNER", "MANAGER", "INVENTORY_MANAGER",
];

const REMINDER_WRITE_ALLOWED_ROLES = [
  "OWNER", "MANAGER", "SERVICE_ADVISOR",
];

/* =========================================================
   STATIC CARD SHELLS
   Each card's identity (id, icon, title, primary button label).
   The live data is fetched and rendered by the card components.
   ========================================================= */

const batteryCard = {
  id: BATTERY_CARD_ID,
  icon: "🔍",
  title: "Battery Problem Detected",
  button: "Recommend load test",
};

const tyreCard = {
  id: TYRE_CARD_ID,
  icon: "🗓️",
  title: "Tyre & Maintenance Reminders",
  button: "Send reminder",
};

const lowStockCard = {
  id: LOW_STOCK_CARD_ID,
  icon: "📦",
  title: "Low Stock — Restock Alerts",
  button: "Raise purchase order",
};

const mechanicCard = {
  id: MECHANIC_ASSIGNMENT_CARD_ID,
  icon: "🔧",
  title: "Mechanic Assignment",
  button: "Accept assignment",
};


/* =========================================================
   SMALL SHARED HELPERS
   ========================================================= */

function isPersistentlyDismissed(key) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function persistDismissal(key) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Private browsing / storage-quota edge cases: dismissal simply
    // does not survive a reload, which is acceptable.
  }
}

function vehicleLabel(vehicle) {
  return [vehicle.registrationNo, vehicle.make, vehicle.model]
    .filter(Boolean)
    .join(" — ") || `Vehicle #${vehicle.id}`;
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toConfidencePercent(raw) {
  const number = Number(raw);
  if (!Number.isFinite(number) || number <= 0) {
    return { percent: "", has: false };
  }
  return {
    percent: `${Math.min(100, Math.max(0, Math.round(number * 100)))}%`,
    has: true,
  };
}

function splitLimitations(value) {
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === "string" && entry.trim());
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function roleOf(user) {
  return typeof user?.role === "string" ? user.role.toUpperCase() : null;
}


/* =========================================================
   MAIN PAGE
   Renders the four connected cards. Tyre and Low Stock dismissals
   are persisted in localStorage; Battery and Mechanic dismissals
   are in-memory only.
   ========================================================= */

function GarageOwnerAIHub() {
  const [dismissedIds, setDismissedIds] = useState(() => {
    const ids = [];
    if (isPersistentlyDismissed(TYRE_DISMISS_KEY)) ids.push(TYRE_CARD_ID);
    if (isPersistentlyDismissed(LOW_STOCK_DISMISS_KEY)) ids.push(LOW_STOCK_CARD_ID);
    return new Set(ids);
  });

  const handleDismiss = (id) => {
    if (id === TYRE_CARD_ID) persistDismissal(TYRE_DISMISS_KEY);
    if (id === LOW_STOCK_CARD_ID) persistDismissal(LOW_STOCK_DISMISS_KEY);
    setDismissedIds((current) => new Set(current).add(id));
  };

  return (
    <div className="garage-ai-page">

      {/* PAGE HEADER */}

      <div className="garage-ai-page-header">

        <div className="garage-ai-heading">

          <div className="garage-ai-eyebrow">
            — AI ASSISTANCE LAYER
          </div>

          <h1>SMARTGARAGE AI</h1>

          <p>
            All AI outputs require human confirmation before affecting
            operational decisions.
          </p>

        </div>

      </div>


      {/* AI ALERT CARDS */}

      <div className="garage-ai-grid">

        <BatteryDiagnosisCard
          card={batteryCard}
          onDismiss={() => handleDismiss(BATTERY_CARD_ID)}
        />

        {!dismissedIds.has(TYRE_CARD_ID) && (
          <TyreReminderCard
            card={tyreCard}
            onDismiss={() => handleDismiss(TYRE_CARD_ID)}
          />
        )}

        {!dismissedIds.has(LOW_STOCK_CARD_ID) && (
          <LowStockCard
            card={lowStockCard}
            onDismiss={() => handleDismiss(LOW_STOCK_CARD_ID)}
          />
        )}

        <MechanicAssignmentCard
          card={mechanicCard}
          onDismiss={() => handleDismiss(MECHANIC_ASSIGNMENT_CARD_ID)}
        />

      </div>

    </div>
  );
}

/* =========================================================
   BATTERY DIAGNOSIS CARD
   Live card backed by POST /api/v1/ai/diagnosis.

   ADVISORY ONLY (SRS BR-09 / FR-AI-04). This card never
   creates or modifies a vehicle, job card, estimate or stock
   record. The backend never does either - it returns a
   recommendation and a disclaimer, and a qualified human
   must confirm before any operational change is made.
   ========================================================= */

function BatteryDiagnosisCard({ card, onDismiss }) {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState("");

  const [vehicleId, setVehicleId] = useState("");
  const [symptoms, setSymptoms] = useState(DEFAULT_BATTERY_SYMPTOMS);

  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState("");
  const [advisoryNote, setAdvisoryNote] = useState("");

  const role = roleOf(user);
  const roleBlocked =
    role !== null && !DIAGNOSIS_ALLOWED_ROLES.includes(role);

  const loadVehicles = useCallback(async () => {
    setVehiclesLoading(true);
    setVehiclesError("");

    try {
      const rows = await getVehicles();
      setVehicles(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setVehiclesError(
        error instanceof Error
          ? error.message
          : "Unable to load vehicles from the vehicle API."
      );
    } finally {
      setVehiclesLoading(false);
    }

  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);


  /* -------------------------------------------------------
     RESULT NORMALISATION

     confidence is a 0.00-1.00 decimal. It is converted to a
     percentage only for display. providerUnavailable wins
     over every other field: when it is true the backend
     returned placeholders, so no diagnosis is presented and
     no confidence figure is shown.
     ------------------------------------------------------- */

  const result = useMemo(() => {
    if (!diagnosis) {
      return null;
    }

    const providerUnavailable = diagnosis.providerUnavailable === true;

    const rawConfidence = Number(diagnosis.confidence);
    const hasConfidence =
      !providerUnavailable &&
      Number.isFinite(rawConfidence) &&
      rawConfidence > 0;

    const confidencePercent = hasConfidence
      ? `${Math.min(100, Math.max(0, Math.round(rawConfidence * 100)))}%`
      : "";

    const limitations = splitLimitations(diagnosis.dataLimitations);

    return {
      providerUnavailable,
      possibleIssue: diagnosis.possibleIssue || "",
      recommendation: diagnosis.recommendation || "",
      confidencePercent,
      hasConfidence,
      disclaimer: diagnosis.disclaimer || "",
      humanReviewRequired: diagnosis.humanReviewRequired !== false,
      generatedAt: diagnosis.generatedAt || "",
      limitations,
    };

  }, [diagnosis]);


  const runDiagnosis = async () => {
    setAdvisoryNote("");
    setDiagnosisError("");

    if (roleBlocked) {
      setDiagnosisError(
        `Your role (${role}) cannot run AI diagnosis. Sign in as an account permitted to request one.`
      );
      return;
    }

    const selectedVehicleId = Number(vehicleId);

    if (!Number.isInteger(selectedVehicleId) || selectedVehicleId <= 0) {
      setDiagnosisError("Select a vehicle before requesting a diagnosis.");
      return;
    }

    const trimmedSymptoms = symptoms.trim();

    if (trimmedSymptoms.length < 5) {
      setDiagnosisError(
        "Describe the reported symptoms in at least 5 characters."
      );
      return;
    }

    setDiagnosisLoading(true);

    try {
      const data = await diagnoseVehicle({
        vehicleId: selectedVehicleId,
        symptoms: trimmedSymptoms,
      });

      setDiagnosis(data);
    } catch (error) {
      setDiagnosis(null);
      setDiagnosisError(
        error instanceof Error
          ? error.message
          : "The AI diagnosis request could not be completed."
      );
    } finally {
      setDiagnosisLoading(false);
    }

  };


  /* The primary action stays advisory. With no result it requests
     the diagnosis; with a result it only surfaces the human
     confirmation notice. Neither path writes to the backend. */

  const handlePrimaryAction = () => {
    if (!result) {
      runDiagnosis();
      return;
    }

    setAdvisoryNote(
      "Advisory recommendation recorded for human review only. " +
        "No vehicle, job card, estimate or stock record was changed. " +
        "A qualified technician must confirm this result before any work is authorised."
    );
  };


  const description = result
    ? result.providerUnavailable
      ? "AI provider unavailable — no diagnosis was produced."
      : result.possibleIssue
    : vehiclesLoading
      ? "Loading vehicles…"
      : "Select a vehicle and the reported symptoms to run an AI diagnosis.";


  return (
    <div className="garage-ai-card">

      {/* CARD TOP */}

      <div className="garage-ai-card-main">

        <div className="garage-ai-icon">
          {card.icon}
        </div>

        <div className="garage-ai-card-content">

          <h2>
            {card.title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        <div className="garage-ai-confidence">

          <div className="garage-ai-confidence-bar">

            <span
              style={{
                width: result?.hasConfidence ? result.confidencePercent : "0%",
              }}
            ></span>

          </div>

          <strong>
            {result?.hasConfidence ? result.confidencePercent : "—"}
          </strong>

        </div>

      </div>


      {/* REQUEST INPUTS */}

      <div className="garage-ai-card-inputs">

        <label className="garage-ai-field">
          <span>Vehicle</span>

          <select
            className="garage-ai-select"
            value={vehicleId}
            onChange={(event) => {
              setVehicleId(event.target.value);
              setDiagnosisError("");
              setDiagnosis(null);
              setAdvisoryNote("");
            }}
            disabled={vehiclesLoading || diagnosisLoading}
          >
            <option value="">
              {vehiclesLoading
                ? "Loading vehicles…"
                : vehicles.length === 0
                  ? "No vehicles available"
                  : "Select a vehicle"}
            </option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={String(vehicle.id)}>
                {vehicleLabel(vehicle)}
              </option>
            ))}
          </select>
        </label>

        <label className="garage-ai-field">
          <span>Reported symptoms</span>

          <textarea
            className="garage-ai-textarea"
            value={symptoms}
            rows={2}
            maxLength={2000}
            onChange={(event) => setSymptoms(event.target.value)}
            disabled={diagnosisLoading}
          ></textarea>
        </label>

      </div>


      {/* RESULT DETAIL */}

      {result && !result.providerUnavailable && (
        <div className="garage-ai-result">

          <p className="garage-ai-result-line">
            <strong>Recommended next step:</strong>{" "}
            {result.recommendation}
          </p>

          {result.limitations.length > 0 && (
            <p className="garage-ai-result-limitations">
              Data limitations: {result.limitations.join(" ")}
            </p>
          )}

          <p className="garage-ai-result-disclaimer">
            {result.disclaimer ||
              "This diagnosis is AI-generated and must be reviewed and confirmed by a qualified technician before any repair work is carried out."}
          </p>
        </div>
      )}

      {result?.providerUnavailable && (
        <div className="garage-ai-result">
          <p className="garage-ai-result-unavailable">
            The AI provider is not configured or did not respond, so no
            diagnosis was generated. No result is shown because none was
            produced. Please proceed with a manual inspection.
          </p>
        </div>
      )}



      {/* STATES */}

      {vehiclesError && (
        <p className="garage-ai-message garage-ai-message-error">
          {vehiclesError}
          <button
            type="button"
            className="garage-ai-retry-button"
            onClick={loadVehicles}
            disabled={vehiclesLoading}
          >
            Retry
          </button>
        </p>
      )}

      {!vehiclesLoading &&
        !vehiclesError &&
        vehicles.length === 0 && (
          <p className="garage-ai-message garage-ai-message-empty">
            No vehicles are available to diagnose. Add a vehicle to this
            garage before running an AI diagnosis.
          </p>
        )}

      {diagnosisLoading && (
        <p className="garage-ai-message garage-ai-message-loading">
          Requesting AI diagnosis…
        </p>
      )}

      {diagnosisError && (
        <p className="garage-ai-message garage-ai-message-error">
          {diagnosisError}
        </p>
      )}

      {advisoryNote && (
        <p className="garage-ai-message garage-ai-message-advisory">
          {advisoryNote}
        </p>
      )}


      {/* CARD ACTIONS */}

      <div className="garage-ai-actions">

        <button
          type="button"
          className="garage-ai-primary-button"
          onClick={handlePrimaryAction}
          disabled={
            diagnosisLoading ||
            vehiclesLoading ||
            vehicles.length === 0 ||
            roleBlocked
          }
        >
          {card.button}
        </button>

        <button
          type="button"
          className="garage-ai-dismiss-button"
          onClick={onDismiss}
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   TYRE & MAINTENANCE REMINDER CARD
   Live card backed by POST /api/v1/ai/maintenance-prediction
   (FR-AI-09..12). The AI provider predicts upcoming maintenance
   for the selected vehicle; the predicted items are shown, and
   "Send reminder" logs a REMINDER communication through
   POST /api/v1/communications (FR-CRM-4).

   ADVISORY ONLY (SRS BR-09). Nothing here creates a job card,
   invoice or stock record, and no message is delivered anywhere
   - the communication is logged to the customer's history.
   ========================================================= */

function TyreReminderCard({ card, onDismiss }) {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState("");

  const [vehicleId, setVehicleId] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const [reminderSending, setReminderSending] = useState(false);
  const [reminderSent, setReminderSent] = useState("");
  const [reminderError, setReminderError] = useState("");

  const role = roleOf(user);
  const roleBlocked = role !== null && !MAINTENANCE_ALLOWED_ROLES.includes(role);
  const canSendReminder =
    role === null || REMINDER_WRITE_ALLOWED_ROLES.includes(role);

  const loadVehicles = useCallback(async () => {
    setVehiclesLoading(true);
    setVehiclesError("");

    try {
      const rows = await getVehicles();
      setVehicles(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setVehiclesError(
        error instanceof Error
          ? error.message
          : "Unable to load vehicles from the vehicle API."
      );
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);


  /* ---- Result normalisation ---- */

  const result = useMemo(() => {
    if (!prediction) return null;

    const providerUnavailable = prediction.providerUnavailable === true;
    const items = Array.isArray(prediction.predictedItems)
      ? prediction.predictedItems
      : [];
    const confidence = toConfidencePercent(
      providerUnavailable ? 0 : prediction.confidence
    );

    return {
      providerUnavailable,
      summary: prediction.summary || "",
      items,
      confidencePercent: confidence.percent,
      hasConfidence: confidence.has,
      limitations: splitLimitations(prediction.dataLimitations),
      disclaimer: prediction.disclaimer || "",
    };
  }, [prediction]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => String(vehicle.id) === String(vehicleId)) || null,
    [vehicles, vehicleId]
  );

  const reminderTarget =
    result && !result.providerUnavailable && result.items.length > 0
      ? result.items[0]
      : null;


  /* ---- Actions ---- */

  const runPrediction = async () => {
    setPredictionError("");
    setReminderSent("");
    setReminderError("");

    if (roleBlocked) {
      setPredictionError(
        `Your role (${role}) cannot request AI maintenance predictions.`
      );
      return;
    }

    const selectedVehicleId = Number(vehicleId);

    if (!Number.isInteger(selectedVehicleId) || selectedVehicleId <= 0) {
      setPredictionError("Select a vehicle before requesting a prediction.");
      return;
    }

    setPredictionLoading(true);

    try {
      const data = await getMaintenancePrediction({
        vehicleId: selectedVehicleId,
      });
      setPrediction(data);
    } catch (error) {
      setPrediction(null);
      setPredictionError(
        error instanceof Error
          ? error.message
          : "The maintenance prediction request could not be completed."
      );
    } finally {
      setPredictionLoading(false);
    }
  };


  const sendReminder = async () => {
    setReminderError("");
    setReminderSent("");

    if (!selectedVehicle) {
      setReminderError("Select the vehicle the prediction was made for.");
      return;
    }

    if (!selectedVehicle.customerId) {
      setReminderError(
        "This vehicle has no linked customer, so a reminder cannot be logged."
      );
      return;
    }

    if (!reminderTarget) {
      setReminderError(
        "No predicted maintenance item is available to remind about."
      );
      return;
    }

    if (role !== null && !canSendReminder) {
      setReminderError(
        `Your role (${role}) cannot log customer communications.`
      );
      return;
    }

    const item = reminderTarget;
    const dueText = [
      item.dueByMileage ? `at ${item.dueByMileage} km` : "",
      item.dueByDate ? `by ${formatDate(item.dueByDate)}` : "",
    ].filter(Boolean).join(" ") || "soon";

    const message =
      `Tyre / maintenance reminder for ${vehicleLabel(selectedVehicle)}. ` +
      `AI prediction: ${item.item} is due ${dueText}.` +
      (item.rationale ? ` ${item.rationale}` : "") +
      " Please schedule a service visit at your earliest convenience.";

    setReminderSending(true);

    try {
      await createCommunication({
        customerId: selectedVehicle.customerId,
        channel: "REMINDER",
        direction: "OUTBOUND",
        subject: "Vehicle maintenance reminder",
        message,
      });
      setReminderSent(
        `Reminder logged for ${selectedVehicle.customerName || `customer #${selectedVehicle.customerId}`}.`
      );
    } catch (error) {
      setReminderError(
        error instanceof Error
          ? error.message
          : "The reminder could not be logged."
      );
    } finally {
      setReminderSending(false);
    }
  };

  const handlePrimaryAction = () => {
    if (!result) {
      runPrediction();
      return;
    }
    sendReminder();
  };

  const description = result
    ? result.providerUnavailable
      ? "AI provider unavailable — no prediction was produced."
      : result.items.length > 0
        ? `${result.items.length} maintenance item${result.items.length === 1 ? "" : "s"} predicted for this vehicle.`
        : result.summary || "No maintenance items were predicted."
    : vehiclesLoading
      ? "Loading vehicles…"
      : "Select a vehicle to run an AI maintenance prediction (tyres included).";


  return (
    <div className="garage-ai-card">

      {/* CARD TOP */}

      <div className="garage-ai-card-main">

        <div className="garage-ai-icon">
          {card.icon}
        </div>

        <div className="garage-ai-card-content">

          <h2>
            {card.title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        <div className="garage-ai-confidence">

          <div className="garage-ai-confidence-bar">

            <span
              style={{
                width: result?.hasConfidence ? result.confidencePercent : "0%",
              }}
            ></span>

          </div>

          <strong>
            {result?.hasConfidence ? result.confidencePercent : "—"}
          </strong>

        </div>

      </div>



      {/* REQUEST INPUTS */}

      <div className="garage-ai-card-inputs">

        <label className="garage-ai-field">
          <span>Vehicle</span>

          <select
            className="garage-ai-select"
            value={vehicleId}
            onChange={(event) => {
              setVehicleId(event.target.value);
              setPrediction(null);
              setPredictionError("");
              setReminderSent("");
              setReminderError("");
            }}
            disabled={vehiclesLoading || predictionLoading || reminderSending}
          >
            <option value="">
              {vehiclesLoading
                ? "Loading vehicles…"
                : vehicles.length === 0
                  ? "No vehicles available"
                  : "Select a vehicle"}
            </option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={String(vehicle.id)}>
                {vehicleLabel(vehicle)}
              </option>
            ))}
          </select>
        </label>

      </div>


      {/* RESULT DETAIL */}

      {result && !result.providerUnavailable && result.items.length > 0 && (
        <div className="garage-ai-result">

          {result.summary && (
            <p className="garage-ai-result-line">
              <strong>Outlook:</strong> {result.summary}
            </p>
          )}

          <ul className="garage-ai-list">
            {result.items.map((item, index) => (
              <li className="garage-ai-list-item" key={index}>
                <span className="garage-ai-item-name">
                  {item.item}
                </span>
                <span className="garage-ai-item-meta">
                  {[
                    item.priority,
                    item.dueByMileage ? `${item.dueByMileage} km` : "",
                    item.dueByDate ? formatDate(item.dueByDate) : "",
                  ].filter(Boolean).join(" · ") || "Due soon"}
                </span>
                {item.rationale && (
                  <span className="garage-ai-item-note">
                    {item.rationale}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {result.limitations.length > 0 && (
            <p className="garage-ai-result-limitations">
              Data limitations: {result.limitations.join(" ")}
            </p>
          )}

          <p className="garage-ai-result-disclaimer">
            {result.disclaimer}
          </p>

        </div>
      )}

      {result?.providerUnavailable && (
        <div className="garage-ai-result">
          <p className="garage-ai-result-unavailable">
            The AI provider is not configured or did not respond, so no
            prediction was generated. Proceed with a manual service check.
          </p>
        </div>
      )}



      {/* STATES */}

      {reminderSent && (
        <p className="garage-ai-message garage-ai-message-success">
          {reminderSent}
        </p>
      )}

      {reminderError && (
        <p className="garage-ai-message garage-ai-message-error">
          {reminderError}
        </p>
      )}

      {predictionError && (
        <p className="garage-ai-message garage-ai-message-error">
          {predictionError}
        </p>
      )}

      {vehiclesError && (
        <p className="garage-ai-message garage-ai-message-error">
          {vehiclesError}
          <button
            type="button"
            className="garage-ai-retry-button"
            onClick={loadVehicles}
            disabled={vehiclesLoading}
          >
            Retry
          </button>
        </p>
      )}

      {!vehiclesLoading &&
        !vehiclesError &&
        vehicles.length === 0 && (
          <p className="garage-ai-message garage-ai-message-empty">
            No vehicles are available to predict maintenance for. Add a
            vehicle to this garage first.
          </p>
        )}

      {predictionLoading && (
        <p className="garage-ai-message garage-ai-message-loading">
          Requesting AI maintenance prediction…
        </p>
      )}

      {roleBlocked && (
        <p className="garage-ai-message garage-ai-message-advisory">
          Your role ({role}) cannot request AI maintenance predictions.
        </p>
      )}


      {/* CARD ACTIONS */}

      <div className="garage-ai-actions">

        <button
          type="button"
          className="garage-ai-primary-button"
          onClick={handlePrimaryAction}
          disabled={
            predictionLoading ||
            reminderSending ||
            vehiclesLoading ||
            vehicles.length === 0 ||
            roleBlocked ||
            (result && !reminderTarget) ||
            (result && !selectedVehicle?.customerId) ||
            (result && role !== null && !canSendReminder)
          }
        >
          {result ? card.button : "Run prediction"}
        </button>

        <button
          type="button"
          className="garage-ai-dismiss-button"
          onClick={onDismiss}
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   LOW STOCK / RESTOCK ALERT CARD
   Live card backed by GET /api/v1/parts/low-stock (the real
   deterministic restock signal: every part at or below its own
   minimum). "Raise purchase order" creates a PENDING purchase
   through POST /api/v1/purchases (FR-INV-2). The backend refuses
   a duplicate open order for the same part, so a double-click
   surfaces as a clear API error instead of a silent duplicate.
   ========================================================= */

function defaultReorderQuantity(part) {
  const minimum = Number(part.minStock) || 0;
  const stock = Number(part.stockQty) || 0;
  return Math.max(1, minimum - stock);
}

function LowStockCard({ card, onDismiss }) {
  const { user } = useAuth();

  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(true);
  const [partsError, setPartsError] = useState("");

  const [quantities, setQuantities] = useState({});
  const [poSendingId, setPoSendingId] = useState(null);
  const [poSuccess, setPoSuccess] = useState({});
  const [poError, setPoError] = useState("");

  const role = roleOf(user);
  const readBlocked =
    role !== null && !LOW_STOCK_READ_ALLOWED_ROLES.includes(role);
  const canRaisePo =
    role === null || PURCHASE_WRITE_ALLOWED_ROLES.includes(role);

  const loadParts = useCallback(async () => {
    setPartsLoading(true);
    setPartsError("");

    try {
      const rows = await getLowStockParts();
      const list = Array.isArray(rows) ? rows : [];
      setParts(list);
      setQuantities(
        Object.fromEntries(
          list.map((part) => [part.id, defaultReorderQuantity(part)])
        )
      );
    } catch (error) {
      setPartsError(
        error instanceof Error
          ? error.message
          : "Unable to load low-stock parts from the inventory API."
      );
    } finally {
      setPartsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);


  const raisePurchaseOrder = async (part) => {
    setPoError("");

    if (role !== null && !canRaisePo) {
      setPoError(`Your role (${role}) cannot raise purchase orders.`);
      return;
    }

    const quantity = Number(quantities[part.id]);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setPoError(`Enter a valid quantity to order for ${part.sku}.`);
      return;
    }

    // unitPrice comes from the part's recorded purchase price, falling back
    // to the selling price when no cost price is on file. Zero is allowed by
    // the backend for free/goodwill lines, never a negative figure.
    const unitPrice = Number(part.purchasePrice ?? part.sellingPrice ?? 0);

    setPoSendingId(part.id);

    try {
      const purchase = await createPurchase({
        supplierId: part.supplierId,
        items: [{ partId: part.id, quantity, unitPrice }],
      });
      setPoSuccess((current) => ({
        ...current,
        [part.id]: `PO #${purchase.id} raised — ${quantity} × ${part.sku} (${part.supplierName || "supplier"})`,
      }));
    } catch (error) {
      setPoError(
        error instanceof Error
          ? error.message
          : "The purchase order could not be raised."
      );
    } finally {
      setPoSendingId(null);
    }
  };

  const description = partsLoading
    ? "Loading low-stock parts…"
    : partsError
      ? "Low-stock feed unavailable."
      : parts.length === 0
        ? "No parts are currently at or below their minimum stock level."
        : `${parts.length} part${parts.length === 1 ? "" : "s"} at or below their minimum stock level.`;



  return (
    <div className="garage-ai-card">

      {/* CARD TOP */}

      <div className="garage-ai-card-main">

        <div className="garage-ai-icon">
          {card.icon}
        </div>

        <div className="garage-ai-card-content">

          <h2>
            {card.title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        {parts.length > 0 && (
          <div className="garage-ai-confidence">
            <strong className="garage-ai-count">
              {parts.length}
            </strong>
          </div>
        )}

      </div>


      {/* LOW STOCK PARTS */}

      {parts.length > 0 && (
        <ul className="garage-ai-list">
          {parts.map((part) => {
            const sent = poSuccess[part.id];
            const ordering = poSendingId === part.id;

            return (
              <li className="garage-ai-list-item" key={part.id}>

                <div className="garage-ai-item-line">
                  <span className="garage-ai-item-name">
                    {part.name || part.sku}
                  </span>
                  <span className="garage-ai-badge">LOW</span>
                </div>

                <div className="garage-ai-item-meta">
                  {part.sku} · stock {part.stockQty ?? 0} / min {part.minStock ?? 0}
                  {part.supplierName ? ` · ${part.supplierName}` : ""}
                </div>

                {!sent && part.supplierId != null && (
                  <div className="garage-ai-purchase-row">

                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="garage-ai-quantity-input"
                      value={quantities[part.id] ?? defaultReorderQuantity(part)}
                      onChange={(event) =>
                        setQuantities((current) => ({
                          ...current,
                          [part.id]: event.target.value,
                        }))
                      }
                      disabled={ordering}
                      aria-label={`Order quantity for ${part.sku}`}
                    />

                    <button
                      type="button"
                      className="garage-ai-secondary-button"
                      onClick={() => raisePurchaseOrder(part)}
                      disabled={ordering || (role !== null && !canRaisePo)}
                    >
                      {ordering ? "Raising…" : "Raise purchase order"}
                    </button>

                  </div>
                )}

                {sent && (
                  <p className="garage-ai-message garage-ai-message-success">
                    {sent}
                  </p>
                )}

                {!sent && part.supplierId == null && (
                  <p className="garage-ai-inline-note">
                    No supplier linked — add a usual supplier to this part
                    before ordering.
                  </p>
                )}

              </li>
            );
          })}
        </ul>
      )}



      {/* STATES */}

      {partsError && (
        <p className="garage-ai-message garage-ai-message-error">
          {partsError}
          <button
            type="button"
            className="garage-ai-retry-button"
            onClick={loadParts}
            disabled={partsLoading}
          >
            Retry
          </button>
        </p>
      )}

      {!partsLoading && !partsError && parts.length === 0 && !readBlocked && (
        <p className="garage-ai-message garage-ai-message-empty">
          No parts are below their minimum stock level right now.
        </p>
      )}

      {poError && (
        <p className="garage-ai-message garage-ai-message-error">
          {poError}
        </p>
      )}

      {readBlocked && (
        <p className="garage-ai-message garage-ai-message-error">
          Your role ({role}) cannot view low-stock inventory.
        </p>
      )}

      {role !== null && !canRaisePo && (
        <p className="garage-ai-message garage-ai-message-advisory">
          Raising purchase orders requires OWNER, MANAGER or
          INVENTORY_MANAGER access.
        </p>
      )}

      {partsLoading && (
        <p className="garage-ai-message garage-ai-message-loading">
          Loading low-stock parts…
        </p>
      )}


      {/* CARD ACTIONS */}

      <div className="garage-ai-actions">

        <button
          type="button"
          className="garage-ai-primary-button"
          onClick={loadParts}
          disabled={partsLoading || readBlocked}
        >
          Refresh stock
        </button>

        <button
          type="button"
          className="garage-ai-dismiss-button"
          onClick={onDismiss}
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   MECHANIC ASSIGNMENT CARD
   Live card backed by POST /api/v1/ai/mechanic-assignment
   (FR-AI-17..20) - a RECOMMENDATION ONLY; the AI endpoint never
   writes the job card. "Accept assignment" then performs the
   real assignment through the existing job card update endpoint
   (PUT /api/v1/job-cards/{id}), echoing the job card's current
   values plus the recommended mechanicId, as JobCardRequestDTO
   requires customerId/vehicleId/serviceType on every update.
   ========================================================= */

function MechanicAssignmentCard({ card, onDismiss }) {
  const { user } = useAuth();

  const [jobCards, setJobCards] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [jobCardId, setJobCardId] = useState("");

  const [recommendation, setRecommendation] = useState(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");

  const [accepting, setAccepting] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState("");
  const [acceptError, setAcceptError] = useState("");

  const role = roleOf(user);
  const roleBlocked =
    role !== null && !MECHANIC_ASSIGNMENT_ALLOWED_ROLES.includes(role);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const [allJobCards, allMechanics] = await Promise.all([
        getJobCards(),
        getMechanics(),
      ]);

      const pending = (Array.isArray(allJobCards) ? allJobCards : [])
        .filter(
          (job) => (job.status || "RECEIVED").toUpperCase() !== "DELIVERED"
        );

      const active = (Array.isArray(allMechanics) ? allMechanics : [])
        .filter(
          (mechanic) => (mechanic.status || "").toUpperCase() === "ACTIVE"
        );

      setJobCards(pending);
      setMechanics(active);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load job cards or mechanics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  /* ---- Result normalisation ---- */

  const result = useMemo(() => {
    if (!recommendation) return null;

    const providerUnavailable = recommendation.providerUnavailable === true;
    const confidence = toConfidencePercent(
      providerUnavailable ? 0 : recommendation.confidence
    );
    const poolSummary = recommendation.candidatePoolSummary || {};

    return {
      providerUnavailable,
      recommendedMechanicId: recommendation.recommendedMechanicId,
      recommendedMechanicName: recommendation.recommendedMechanicName,
      recommendedMechanicEmployeeCode:
        recommendation.recommendedMechanicEmployeeCode,
      rationale: recommendation.rationale,
      confidencePercent: confidence.percent,
      hasConfidence: confidence.has,
      alreadyAssigned: poolSummary.alreadyAssigned === true,
      jobCardStatus: poolSummary.jobCardStatus || "",
      activeCandidateCount: poolSummary.activeCandidateCount,
      limitations: splitLimitations(recommendation.dataLimitations),
      disclaimer: recommendation.disclaimer || "",
    };
  }, [recommendation]);


  /* ---- Actions ---- */

  const runRecommendation = async () => {
    setRecommendationError("");
    setAcceptError("");
    setAcceptSuccess("");

    if (roleBlocked) {
      setRecommendationError(
        `Your role (${role}) cannot request AI mechanic recommendations.`
      );
      return;
    }

    const selectedJobCardId = Number(jobCardId);

    if (!Number.isInteger(selectedJobCardId) || selectedJobCardId <= 0) {
      setRecommendationError(
        "Select a pending job card before requesting a recommendation."
      );
      return;
    }

    setRecommendationLoading(true);

    try {
      const data = await recommendMechanic({
        jobCardId: selectedJobCardId,
      });
      setRecommendation(data);
    } catch (error) {
      setRecommendation(null);
      setRecommendationError(
        error instanceof Error
          ? error.message
          : "The mechanic recommendation request could not be completed."
      );
    } finally {
      setRecommendationLoading(false);
    }
  };

  const acceptAssignment = async () => {
    setAcceptError("");
    setAcceptSuccess("");

    if (!result || !result.recommendedMechanicId) {
      setAcceptError(
        "No validated mechanic was recommended, so nothing can be assigned."
      );
      return;
    }

    if (role !== null && roleBlocked) {
      setAcceptError(`Your role (${role}) cannot modify job cards.`);
      return;
    }

    const selectedJobCardId = Number(jobCardId);

    if (!Number.isInteger(selectedJobCardId) || selectedJobCardId <= 0) {
      setAcceptError("Select the job card the recommendation was made for.");
      return;
    }

    setAccepting(true);

    try {
      const job = await getJobCard(selectedJobCardId);

      // The job card update DTO requires the core fields on every call, so
      // the existing record's values are echoed back with the new mechanic.
      const updated = await updateJobCard(selectedJobCardId, {
        customerId: job.customerId,
        vehicleId: job.vehicleId,
        serviceType: job.serviceType,
        complaint: job.complaint,
        technicianNotes: job.technicianNotes,
        odometerReading: job.odometerReading,
        estimatedDelivery: job.estimatedDelivery,
        estimatedCost: job.estimatedCost,
        status: job.status,
        mechanicId: result.recommendedMechanicId,
      });

      setAcceptSuccess(
        `${result.recommendedMechanicName || "Recommended mechanic"} assigned to ${updated.jobCardNumber || job.jobCardNumber}.`
      );

      // Refresh the pending list so the card reflects the new assignment.
      loadData();
    } catch (error) {
      setAcceptError(
        error instanceof Error
          ? error.message
          : "The assignment could not be saved."
      );
    } finally {
      setAccepting(false);
    }
  };

  const handlePrimaryAction = () => {
    if (!result) {
      runRecommendation();
      return;
    }
    acceptAssignment();
  };

  const canAccept =
    result &&
    !result.providerUnavailable &&
    result.recommendedMechanicId != null &&
    !acceptSuccess;

  const description = result
    ? result.providerUnavailable
      ? "AI provider unavailable — no recommendation was produced."
      : result.alreadyAssigned
        ? "This job card already has a mechanic assigned — review before reassigning."
        : result.recommendedMechanicName
          ? `Recommended: ${result.recommendedMechanicName}.`
          : "No validated mechanic was recommended — assign manually."
    : loading
      ? "Loading job cards…"
      : "Select a pending job card to get an AI mechanic recommendation.";



  return (
    <div className="garage-ai-card">

      {/* CARD TOP */}

      <div className="garage-ai-card-main">

        <div className="garage-ai-icon">
          {card.icon}
        </div>

        <div className="garage-ai-card-content">

          <h2>
            {card.title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        <div className="garage-ai-confidence">

          <div className="garage-ai-confidence-bar">

            <span
              style={{
                width: result?.hasConfidence ? result.confidencePercent : "0%",
              }}
            ></span>

          </div>

          <strong>
            {result?.hasConfidence ? result.confidencePercent : "—"}
          </strong>

        </div>

      </div>


      {/* REQUEST INPUTS */}

      <div className="garage-ai-card-inputs">

        <label className="garage-ai-field">
          <span>Job card</span>

          <select
            className="garage-ai-select"
            value={jobCardId}
            onChange={(event) => {
              setJobCardId(event.target.value);
              setRecommendation(null);
              setRecommendationError("");
              setAcceptSuccess("");
              setAcceptError("");
            }}
            disabled={loading || recommendationLoading || accepting}
          >
            <option value="">
              {loading
                ? "Loading job cards…"
                : jobCards.length === 0
                  ? "No pending job cards"
                  : "Select a pending job card"}
            </option>

            {jobCards.map((job) => (
              <option key={job.id} value={String(job.id)}>
                {`${job.jobCardNumber} — ${job.serviceType || "Service"} (${job.status || "RECEIVED"})`}
              </option>
            ))}
          </select>
        </label>

      </div>


      {/* RESULT DETAIL */}

      {result && !result.providerUnavailable && (
        <div className="garage-ai-result">

          {result.recommendedMechanicName && (
            <p className="garage-ai-result-line">
              <strong>Recommended mechanic:</strong>{" "}
              {result.recommendedMechanicName}
              {result.recommendedMechanicEmployeeCode
                ? ` (${result.recommendedMechanicEmployeeCode})`
                : ""}
            </p>
          )}

          {result.rationale && (
            <p className="garage-ai-result-line">
              <strong>Why:</strong> {result.rationale}
            </p>
          )}

          <p className="garage-ai-result-limitations">
            {result.alreadyAssigned
              ? `This job card (${result.jobCardStatus}) already has a mechanic assigned — accepting will reassign it. `
              : ""}
            {result.activeCandidateCount != null
              ? `${result.activeCandidateCount} active mechanic${result.activeCandidateCount === 1 ? "" : "s"} considered. `
              : ""}
            {result.recommendedMechanicName ? result.limitations.join(" ") : (result.limitations.length > 0 ? result.limitations.join(" ") : "No recommendation was produced. Please assign the work manually.")}
          </p>

          <p className="garage-ai-result-disclaimer">
            {result.disclaimer}
          </p>

        </div>
      )}

      {result?.providerUnavailable && (
        <div className="garage-ai-result">
          <p className="garage-ai-result-unavailable">
            The AI provider is not configured or did not respond, so no
            recommendation was produced. Assign the work manually.
          </p>
        </div>
      )}



      {/* STATES */}

      {acceptSuccess && (
        <p className="garage-ai-message garage-ai-message-success">
          {acceptSuccess}
        </p>
      )}

      {acceptError && (
        <p className="garage-ai-message garage-ai-message-error">
          {acceptError}
        </p>
      )}

      {recommendationError && (
        <p className="garage-ai-message garage-ai-message-error">
          {recommendationError}
        </p>
      )}

      {loadError && (
        <p className="garage-ai-message garage-ai-message-error">
          {loadError}
          <button
            type="button"
            className="garage-ai-retry-button"
            onClick={loadData}
            disabled={loading}
          >
            Retry
          </button>
        </p>
      )}

      {!loading && !loadError && jobCards.length === 0 && (
        <p className="garage-ai-message garage-ai-message-empty">
          No pending job cards are available to recommend a mechanic for.
        </p>
      )}

      {recommendationLoading && (
        <p className="garage-ai-message garage-ai-message-loading">
          Requesting AI mechanic recommendation…
        </p>
      )}

      {accepting && (
        <p className="garage-ai-message garage-ai-message-loading">
          Assigning recommended mechanic…
        </p>
      )}

      {roleBlocked && (
        <p className="garage-ai-message garage-ai-message-advisory">
          Your role ({role}) cannot request mechanic recommendations or
          assign job cards.
        </p>
      )}

      {mechanics.length === 0 && !loading && !loadError && !roleBlocked && (
        <p className="garage-ai-message garage-ai-message-advisory">
          No ACTIVE mechanics are on record, so the AI cannot recommend one.
        </p>
      )}


      {/* CARD ACTIONS */}

      <div className="garage-ai-actions">

        <button
          type="button"
          className="garage-ai-primary-button"
          onClick={handlePrimaryAction}
          disabled={
            recommendationLoading ||
            accepting ||
            loading ||
            jobCards.length === 0 ||
            roleBlocked ||
            (result && !canAccept)
          }
        >
          {result ? card.button : "Get recommendation"}
        </button>

        <button
          type="button"
          className="garage-ai-dismiss-button"
          onClick={onDismiss}
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}


export default GarageOwnerAIHub;














