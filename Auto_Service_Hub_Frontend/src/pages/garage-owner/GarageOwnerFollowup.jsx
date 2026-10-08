import React, { useEffect, useState } from "react";
import { customersApi, followupsApi, jobCardsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerFollowup.css";

const emptyForm = { customerId: "", jobCardId: "", dueDate: "", reason: "" };

function GarageOwnerFollowup() {
  const [followups, setFollowups] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [followupRows, customerRows, jobRows] = await Promise.all([
        followupsApi.list(),
        customersApi.list(),
        jobCardsApi.list(),
      ]);
      setFollowups(followupRows);
      setCustomers(customerRows);
      setJobCards(jobRows);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const createFollowup = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await followupsApi.create({
        customerId: Number(form.customerId),
        jobCardId: form.jobCardId ? Number(form.jobCardId) : null,
        dueDate: form.dueDate,
        reason: form.reason.trim(),
        status: "PENDING",
      });
      setFollowups((current) => [created, ...current]);
      setForm(emptyForm);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (item, status) => {
    setError("");
    try {
      const updated = await followupsApi.update(item.id, {
        customerId: item.customerId,
        jobCardId: item.jobCardId,
        dueDate: item.dueDate,
        reason: item.reason,
        status,
      });
      setFollowups((current) => current.map((row) => row.id === updated.id ? updated : row));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <main className="api-data-page">
      <header className="api-data-header">
        <div><p>WORKSHOP OPERATIONS</p><h1>Customer follow-ups</h1></div>
      </header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      <section className="api-data-card">
        <h2>Schedule a follow-up</h2>
        <form className="api-data-form" onSubmit={createFollowup}>
          <label>Customer
            <select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Select customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} ({customer.phone})</option>)}
            </select>
          </label>
          <label>Related job card (optional)
            <select value={form.jobCardId} onChange={(e) => setForm({ ...form, jobCardId: e.target.value })}>
              <option value="">None</option>
              {jobCards.map((job) => <option key={job.id} value={job.id}>{job.jobCardNumber || `Job #${job.id}`}</option>)}
            </select>
          </label>
          <label>Due date<input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
          <label>Reason<input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. post-service check" /></label>
          <button disabled={saving}>{saving ? "Saving…" : "Create follow-up"}</button>
        </form>
      </section>
      <section className="api-data-card">
        <h2>Follow-up records</h2>
        {loading ? <p role="status">Loading follow-ups…</p> : (
          <div className="api-data-table-wrap"><table className="api-data-table">
            <thead><tr><th>Customer</th><th>Phone</th><th>Due date</th><th>Reason</th><th>Job card</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>{followups.map((item) => <tr key={item.id}>
              <td>{item.customerName}</td><td>{item.customerPhone || "—"}</td><td>{item.dueDate}</td>
              <td>{item.reason}</td><td>{item.jobCardNumber || "—"}</td><td>{item.status}</td>
              <td>{item.closed ? "—" : <select aria-label={`Update ${item.customerName} follow-up`} value={item.status} onChange={(e) => updateStatus(item, e.target.value)}>
                <option value="PENDING">PENDING</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="COMPLETED">COMPLETED</option><option value="CANCELLED">CANCELLED</option>
              </select>}</td>
            </tr>)}</tbody>
          </table>{!followups.length && <p>No follow-ups recorded.</p>}</div>
        )}
      </section>
    </main>
  );
}

export default GarageOwnerFollowup;
