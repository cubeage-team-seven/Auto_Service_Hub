import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { jobCardsApi } from "../../services/resources";
import {
  updateJobTaskNotes,
  updateJobTaskStatus,
  consumeJobCardPart,
  getJobCardPartCatalog,
  getJobCardParts,
} from "../../services/jobCardService";
import { getErrorMessage } from "../../services/api";
import "./JobCardDetailsPage.css";

const TASK_STATUS_OPTIONS = {
  PENDING: ["PENDING", "IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED"],
};

export default function JobCardDetailsPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const role = String(user?.role || "").replace(/^ROLE_/i, "").toUpperCase();
  const isMechanic = role === "MECHANIC";
  const canCreateTasks = ["ADMIN", "OWNER", "GARAGE_OWNER", "MANAGER", "SERVICE_ADVISOR"].includes(role);
  const canConsumeParts = ["ADMIN", "OWNER", "GARAGE_OWNER", "MANAGER", "MECHANIC"].includes(role);
  const [job, setJob] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [consumedParts, setConsumedParts] = useState([]);
  const [partsCatalog, setPartsCatalog] = useState([]);
  const [form, setForm] = useState({ description: "", labourCost: "0", workNotes: "" });
  const [partForm, setPartForm] = useState({ partId: "", quantity: "1", reason: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTaskId, setSavingTaskId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      jobCardsApi.get(jobId),
      jobCardsApi.tasks(jobId),
      getJobCardParts(jobId),
      getJobCardPartCatalog(),
    ])
      .then(([jobRecord, taskRecords, partRecords, catalog]) => {
        setJob(jobRecord);
        setTasks(taskRecords);
        setConsumedParts(partRecords);
        setPartsCatalog(catalog);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [jobId]);

  const addTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await jobCardsApi.createTask(jobId, {
        description: form.description.trim(),
        labourCost: Number(form.labourCost || 0),
        workNotes: form.workNotes.trim() || null,
        status: "PENDING",
      });
      setTasks((current) => [...current, created]);
      setForm({ description: "", labourCost: "0", workNotes: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const updateTask = (updatedTask) => {
    setTasks((current) =>
      current.map((task) => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  const saveTaskStatus = async (task, nextStatus) => {
    setSavingTaskId(task.id);
    setError("");
    try {
      updateTask(await updateJobTaskStatus(task.id, nextStatus));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingTaskId(null);
    }
  };

  const saveTaskNotes = async (task, workNotes) => {
    setSavingTaskId(task.id);
    setError("");
    try {
      updateTask(await updateJobTaskNotes(task.id, workNotes));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingTaskId(null);
    }
  };

  const recordPartConsumption = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const movement = await consumeJobCardPart(
        job.id,
        partForm.partId,
        partForm.quantity,
        partForm.reason.trim()
      );
      setConsumedParts((current) => [...current, movement]);
      setPartForm({ partId: "", quantity: "1", reason: "" });
      try {
        setPartsCatalog(await getJobCardPartCatalog());
      } catch (refreshError) {
        const detail = getErrorMessage(refreshError, "Inventory refresh failed.");
        setError(`Part consumption was recorded, but available inventory could not be refreshed: ${detail}`);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="api-data-page"><p role="status">Loading job card…</p></main>;
  if (error && !job) return <main className="api-data-page"><div className="api-data-error" role="alert">{error}</div><Link to="/job-cards">Back to job cards</Link></main>;
  if (!job) return <main className="api-data-page"><p>Job card not found.</p><Link to="/job-cards">Back to job cards</Link></main>;

  return (
    <main className="api-data-page">
      <header className="api-data-header"><div><p>JOB CARD / {job.jobCardNumber}</p><h1>{job.customerName} — {job.serviceType}</h1></div><Link to="/job-cards">Back to job cards</Link></header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      <section className="api-data-kpis">
        <div className="api-data-kpi"><span>VEHICLE</span><strong>{job.vehicleInfo || "—"}</strong></div>
        <div className="api-data-kpi"><span>MECHANIC</span><strong>{job.mechanicName || "Unassigned"}</strong></div>
        <div className="api-data-kpi"><span>STATUS</span><strong>{job.status}</strong></div>
        <div className="api-data-kpi"><span>ESTIMATED COST</span><strong>{job.estimatedCost == null ? "—" : `₹${Number(job.estimatedCost).toLocaleString("en-IN")}`}</strong></div>
      </section>
      <section className="api-data-card">
        <h2>Job information</h2>
        <p><strong>Complaint:</strong> {job.complaint || "—"}</p>
        <p><strong>Technician notes:</strong> {job.technicianNotes || "—"}</p>
        <p><strong>Estimated delivery:</strong> {job.estimatedDelivery ? new Date(job.estimatedDelivery).toLocaleString() : "—"}</p>
      </section>
      <section className="api-data-card">
        <h2>Repair tasks</h2>
        <div className="api-data-table-wrap"><table className="api-data-table">
          <thead><tr><th>Task</th><th>Mechanic</th><th>Status</th><th>Labour cost</th><th>Work notes</th>{isMechanic && <th>Progress</th>}</tr></thead>
          <tbody>{tasks.map((task) => <tr key={task.id}>
            <td>{task.description}</td><td>{task.mechanicName || "Unassigned"}</td><td>{task.status}</td>
            <td>₹{Number(task.labourCost || 0).toLocaleString("en-IN")}</td><td>{task.workNotes || "—"}</td>
            {isMechanic && <td><TaskProgressEditor
              task={task}
              disabled={job.status === "DELIVERED" || savingTaskId === task.id}
              onStatusChange={(nextStatus) => saveTaskStatus(task, nextStatus)}
              onNotesSave={(notes) => saveTaskNotes(task, notes)}
            /></td>}
          </tr>)}</tbody>
        </table>{!tasks.length && <p>No tasks recorded.</p>}</div>
      </section>
      {canConsumeParts && <section className="api-data-card">
        <h2>Parts used</h2>
        {consumedParts.length
          ? <ul>{consumedParts.map((part) => (
            <li key={part.id}>{part.partName || part.partSku || `Part ${part.partId}`} — quantity {part.quantity}{part.reason ? ` · ${part.reason}` : ""}</li>
          ))}</ul>
          : <p>No parts have been recorded for this job card.</p>}
        {job.status !== "DELIVERED" && <form className="api-data-form" onSubmit={recordPartConsumption}>
          <label>Part<select required value={partForm.partId} onChange={(event) => setPartForm({ ...partForm, partId: event.target.value })}>
            <option value="">Select inventory part</option>
            {partsCatalog.map((part) => <option key={part.id} value={part.id}>{part.name} · {part.sku} · stock {part.stockQty}</option>)}
          </select></label>
          <label>Quantity<input type="number" min="1" step="1" required value={partForm.quantity} onChange={(event) => setPartForm({ ...partForm, quantity: event.target.value })} /></label>
          <label>Reason / note<input value={partForm.reason} onChange={(event) => setPartForm({ ...partForm, reason: event.target.value })} /></label>
          <button disabled={saving || partsCatalog.length === 0}>{saving ? "Saving…" : "Record parts used"}</button>
        </form>}
      </section>}
      {canCreateTasks && <section className="api-data-card">
        <h2>Add a repair task</h2>
        <form className="api-data-form" onSubmit={addTask}>
          <label>Description<input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Labour cost<input type="number" min="0" step="0.01" value={form.labourCost} onChange={(e) => setForm({ ...form, labourCost: e.target.value })} /></label>
          <label>Work notes<input value={form.workNotes} onChange={(e) => setForm({ ...form, workNotes: e.target.value })} /></label>
          <button disabled={saving}>{saving ? "Saving…" : "Add task"}</button>
        </form>
      </section>}
    </main>
  );
}

function TaskProgressEditor({ task, disabled, onStatusChange, onNotesSave }) {
  const [status, setStatus] = useState(task.status || "PENDING");
  const [notes, setNotes] = useState(task.workNotes || "");

  useEffect(() => {
    setStatus(task.status || "PENDING");
    setNotes(task.workNotes || "");
  }, [task]);

  const options = TASK_STATUS_OPTIONS[task.status] || [task.status || "PENDING"];

  return (
    <div className="api-data-form">
      <label>Status<select
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
        }}
        disabled={disabled}
      >
        {options.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}
      </select></label>
      {status !== task.status && <button
        type="button"
        onClick={() => onStatusChange(status)}
        disabled={disabled}
      >
        Update status
      </button>}
      <label>Work notes<input
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        disabled={disabled}
      /></label>
      <button type="button" onClick={() => onNotesSave(notes)} disabled={disabled}>
        Save notes
      </button>
    </div>
  );
}
