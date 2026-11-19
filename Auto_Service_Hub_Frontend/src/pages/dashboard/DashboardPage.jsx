import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getDashboardJobCards } from "../../services/dashboardService";
import MechanicDashboard from "../mechanic/MechanicDashboard";
import "./DashboardPage.css";

const ACTIVE_STATUSES = new Set([
  "RECEIVED",
  "INSPECTION",
  "IN_REPAIR",
  "QUALITY_CHECK",
]);

const normalizeStatus = (status) =>
  String(status || "").trim().toUpperCase().replace(/[\s-]+/g, "_");

const isActiveJob = (job) => ACTIVE_STATUSES.has(normalizeStatus(job.status));

const statusClass = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "IN_REPAIR") return "repair";
  if (normalized === "QUALITY_CHECK") return "quality";
  if (normalized === "DELIVERED") return "delivered";
  if (normalized === "INSPECTION") return "inspection";
  if (normalized === "RECEIVED") return "received";
  return "";
};

const readableStatus = (status) =>
  String(status || "Unknown")
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const assignedDate = (job) => job.assignedDate || job.createdAt;

function DashboardPage() {
  const { user } = useAuth();
  const role = String(user?.role || "").replace(/^ROLE_/i, "").toUpperCase();

  return role === "MECHANIC"
    ? <MechanicDashboard />
    : <SharedDashboardPage />;
}

function SharedDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [jobsState, setJobsState] = useState({ status: "loading", jobs: [] });
  const { user } = useAuth();
  const role = String(user?.role || "").replace(/^ROLE_/i, "").toUpperCase();
  const isMechanic = role === "MECHANIC";
  const today = new Date();
  const todayLabel = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  useEffect(() => {
    let active = true;
    setJobsState((current) => ({ ...current, status: "loading", error: null }));

    getDashboardJobCards()
      .then((jobs) => {
        if (active) setJobsState({ status: "success", jobs });
      })
      .catch((error) => {
        if (active) {
          setJobsState({
            status: "error",
            jobs: [],
            error: error instanceof Error ? error.message : "Unable to load assigned jobs.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const assignedToday = jobsState.status === "success"
    ? jobsState.jobs.filter((job) => {
        const value = assignedDate(job);
        if (!value) return false;
        const date = new Date(value);
        return !Number.isNaN(date.getTime()) && date.toDateString() === today.toDateString();
      })
    : [];

  const activeToday = assignedToday.filter(isActiveJob).length;
  const deliveredToday = assignedToday.filter(
    (job) => normalizeStatus(job.status) === "DELIVERED"
  ).length;
  const activeJobs = jobsState.status === "success"
    ? jobsState.jobs.filter(isActiveJob)
    : [];
  const headingDate = `— TODAY, ${todayLabel}`;
  const refresh = () => setRefreshKey((key) => key + 1);

  return (
    <div className="garage-dashboard-page">
      <section className="garage-dashboard-heading">
        <div className="garage-dashboard-date">{headingDate}</div>
        <h1>MY WORKSPACE</h1>
      </section>

      <section className="garage-dashboard-stats">
        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">TODAY&apos;S ASSIGNED JOBS</div>
          <div className="garage-dashboard-stat-value lime">
            {jobsState.status === "loading"
              ? "…"
              : jobsState.status === "error"
                ? "—"
                : assignedToday.length}
          </div>
          <div className="garage-dashboard-stat-description">
            {jobsState.status === "loading"
              ? "Loading assigned jobs…"
              : jobsState.status === "error"
                ? "Job data is unavailable"
                : `${activeToday} active · ${deliveredToday} delivered`}
          </div>
        </div>
      </section>

      <section className="garage-dashboard-middle">
        <div className="garage-dashboard-panel garage-dashboard-jobs">
          <div className="garage-dashboard-panel-title">
            <span>ACTIVE JOB CARDS</span>
            <button
              type="button"
              className="garage-dashboard-refresh"
              onClick={refresh}
              disabled={jobsState.status === "loading"}
            >
              {jobsState.status === "loading" ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          <div className="garage-dashboard-table-wrapper" aria-live="polite">
            <table className="garage-dashboard-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>ASSIGNED MECHANIC</th>
                  <th>STATUS</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {jobsState.status === "loading" ? (
                  <tr>
                    <td colSpan="6" className="garage-dashboard-state">
                      Loading assigned job cards…
                    </td>
                  </tr>
                ) : jobsState.status === "error" ? (
                  <tr>
                    <td colSpan="6" className="garage-dashboard-state error" role="alert">
                      {jobsState.error}
                    </td>
                  </tr>
                ) : activeJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="garage-dashboard-state">
                      {isMechanic
                        ? "No active job cards are currently assigned to you."
                        : "No active job cards are available for this workspace."}
                    </td>
                  </tr>
                ) : (
                  activeJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="garage-dashboard-job-id">
                        {job.jobCardNumber || `JC-${job.id}`}
                      </td>
                      <td className="garage-dashboard-customer">
                        {job.customerName || "—"}
                      </td>
                      <td className="garage-dashboard-vehicle">
                        {job.vehicleInfo || "—"}
                      </td>
                      <td className="garage-dashboard-mechanic">
                        {isMechanic ? "You" : job.mechanicName || "—"}
                      </td>
                      <td>
                        <span className={`garage-dashboard-status ${statusClass(job.status)}`}>
                          {readableStatus(job.status)}
                        </span>
                      </td>
                      <td className="garage-dashboard-eta">
                        {formatDateTime(job.estimatedDelivery)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
