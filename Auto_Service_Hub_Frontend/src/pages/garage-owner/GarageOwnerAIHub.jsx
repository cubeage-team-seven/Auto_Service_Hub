import React, { useEffect, useState } from "react";
import { aiApi, vehiclesApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerAIHub.css";

function GarageOwnerAIHub() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicleId: "", symptoms: "", inspectionFindings: "", technicianNotes: "" });
  const [result, setResult] = useState(null);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    vehiclesApi.list()
      .then(setVehicles)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoadingVehicles(false));
  }, []);

  const diagnose = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        symptoms: form.symptoms.trim(),
        inspectionFindings: form.inspectionFindings.trim() || null,
        technicianNotes: form.technicianNotes.trim() || null,
      };
      if (form.vehicleId) payload.vehicleId = Number(form.vehicleId);
      setResult(await aiApi.post("diagnosis", payload));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="garage-ai-page">
      <div className="garage-ai-page-header">
        <div className="garage-ai-heading">
          <div className="garage-ai-eyebrow">AI ASSISTANCE LAYER</div>
          <h1>VEHICLE DIAGNOSIS</h1>
          <p>Recommendations are advisory only. A qualified technician must review and confirm before repair work begins.</p>
        </div>
      </div>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      <section className="api-data-card">
        <form className="api-data-form" onSubmit={diagnose}>
          <label>Vehicle (optional)
            <select disabled={loadingVehicles} value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">{loadingVehicles ? "Loading vehicles…" : "No vehicle selected"}</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registrationNo} — {vehicle.make} {vehicle.model}</option>)}
            </select>
          </label>
          <label>Reported symptoms
            <textarea required maxLength="2000" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
          </label>
          <label>Inspection findings (optional)
            <textarea maxLength="2000" value={form.inspectionFindings} onChange={(e) => setForm({ ...form, inspectionFindings: e.target.value })} />
          </label>
          <label>Technician notes (optional)
            <textarea maxLength="2000" value={form.technicianNotes} onChange={(e) => setForm({ ...form, technicianNotes: e.target.value })} />
          </label>
          <button disabled={submitting}>{submitting ? "Analyzing…" : "Request diagnosis"}</button>
        </form>
      </section>
      {result && <section className="api-data-card" aria-live="polite">
        <h2>Diagnosis result</h2>
        {result.providerUnavailable && <div className="api-data-error">The AI provider is unavailable. No diagnosis was generated.</div>}
        <p><strong>Possible issue:</strong> {result.possibleIssue || "No result provided."}</p>
        <p><strong>Recommendation:</strong> {result.recommendation || "No recommendation provided."}</p>
        {result.confidence != null && <p><strong>Confidence:</strong> {Number(result.confidence * 100).toFixed(0)}%</p>}
        <p>{result.disclaimer}</p>
      </section>}
    </div>
  );
}

export default GarageOwnerAIHub;
