import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../services/api";
import { accessRequestsApi } from "../../services/resources";
import "../admin/Admin.css";

const roles = [
  ["OWNER", "Garage owner"],
  ["SERVICE_ADVISOR", "Service advisor"],
  ["MECHANIC", "Mechanic"],
  ["INVENTORY_MANAGER", "Inventory manager"],
  ["BILLING_USER", "Billing staff"],
];

export default function AccessRequestPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requestedRole: "OWNER",
    message: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await accessRequestsApi.submit(form);
      setSubmitted(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not submit your access request."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="access-request-page">
      <section className="access-request-card">
        <Link to="/modules">← Back to sign in</Link>
        <p className="access-request-kicker">Auto_Service_Hub AI CRM</p>
        <h1>Request platform access</h1>
        {submitted ? (
          <div className="access-request-success" role="status">
            Your request was sent to the administrator for review. If approved, the administrator will provide your sign-in details.
          </div>
        ) : (
          <>
            <p>Owner and staff accounts require administrator approval. This application is for workshop personnel; customers do not have application accounts or sign-in access.</p>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <form onSubmit={submit} className="admin-form-grid">
              <label>Full name<input required maxLength="150" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label>Email<input type="email" required maxLength="150" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
              <label>Phone<input maxLength="30" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
              <label>Access requested
                <select value={form.requestedRole} onChange={(event) => setForm({ ...form, requestedRole: event.target.value })}>
                  {roles.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label className="admin-form-wide">Why do you need access?
                <textarea maxLength="1000" rows="4" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
              </label>
              <button className="admin-primary-button" type="submit" disabled={saving}>
                {saving ? "Submitting…" : "Submit access request"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
