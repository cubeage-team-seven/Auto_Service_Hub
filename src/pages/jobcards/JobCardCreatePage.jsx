import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../../services/customerService";
import { getVehicles } from "../../services/vehicleService";
import { getMechanics } from "../../services/mechanicService";
import { createJobCard } from "../../services/jobCardService";
import "./JobCardCreatePage.css";

function JobCardCreatePage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    mechanicId: "",
    odometer: "",
    serviceType: "Basic Service",
    complaint: "",
    estimatedDelivery: "",
    estimatedCost: "",
    technicianNotes: "",
  });

  useEffect(() => {
    getCustomers(0, 100).then((p) => setCustomers(p.content ?? [])).catch(() => {});
    getVehicles(0, 100).then((p) => setVehicles(p.content ?? [])).catch(() => {});
    getMechanics(0, 100).then((p) => setMechanics(p.content ?? [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createJobCard({
        customerId: Number(formData.customerId),
        vehicleId: Number(formData.vehicleId),
        mechanicId: formData.mechanicId ? Number(formData.mechanicId) : null,
        serviceType: formData.serviceType,
        complaint: formData.complaint,
        technicianNotes: formData.technicianNotes,
        odometerReading: formData.odometer ? Number(formData.odometer) : null,
        estimatedDelivery: formData.estimatedDelivery || null,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : null,
        status: "RECEIVED",
      });
      navigate("/job-cards");
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to create job card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-create-overlay">
      <div className="job-create-backdrop" onClick={() => navigate("/job-cards")}></div>

      <div className="job-create-modal">
        <div className="job-create-modal-header">
          <h2>NEW JOB CARD</h2>
          <button type="button" className="job-create-close" onClick={() => navigate("/job-cards")}>×</button>
        </div>

        {error && <div style={{ color: "#f87171", padding: "0 1.5rem", fontSize: "0.85rem" }}>{error}</div>}

        <form className="job-create-modal-form" onSubmit={handleSubmit}>

          <div className="job-create-field">
            <label>CUSTOMER</label>
            <select name="customerId" value={formData.customerId} onChange={handleChange} required>
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>
          </div>

          <div className="job-create-field">
            <label>VEHICLE</label>
            <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required>
              <option value="">Select vehicle...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNo} | {v.make} {v.model}</option>
              ))}
            </select>
          </div>

          <div className="job-create-field">
            <label>ASSIGN MECHANIC</label>
            <select name="mechanicId" value={formData.mechanicId} onChange={handleChange}>
              <option value="">Unassigned</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="job-create-field">
            <label>ODOMETER READING (KM)</label>
            <input type="number" name="odometer" value={formData.odometer} onChange={handleChange} placeholder="43200" />
          </div>

          <div className="job-create-field">
            <label>SERVICE TYPE</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option>Basic Service</option>
              <option>Full Service</option>
              <option>Engine Overhaul</option>
              <option>AC Repair + Service</option>
              <option>Brake Replacement</option>
              <option>Suspension + Tyres</option>
              <option>Electrical</option>
              <option>Tyre Replacement</option>
            </select>
          </div>

          <div className="job-create-field">
            <label>CUSTOMER COMPLAINT</label>
            <textarea name="complaint" value={formData.complaint} onChange={handleChange} placeholder="Describe the customer's complaint..." rows="3" />
          </div>

          <div className="job-create-field">
            <label>ESTIMATED DELIVERY</label>
            <input type="datetime-local" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange} />
          </div>

          <div className="job-create-field">
            <label>ESTIMATED COST (₹)</label>
            <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} placeholder="0" min="0" />
          </div>

          <div className="job-create-field">
            <label>TECHNICIAN NOTES</label>
            <textarea name="technicianNotes" value={formData.technicianNotes} onChange={handleChange} placeholder="Initial technician observations..." rows="3" />
          </div>

          <div className="job-create-actions">
            <button type="submit" className="job-create-submit" disabled={submitting}>
              {submitting ? "CREATING..." : "CREATE JOB CARD"}
            </button>
            <button type="button" className="job-create-cancel" onClick={() => navigate("/job-cards")}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default JobCardCreatePage;
