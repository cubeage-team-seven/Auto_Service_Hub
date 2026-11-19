import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardJobCards,
  getDashboardNotifications,
} from "../../services/dashboardService";
import { getAssignedJobTasks } from "../../services/jobCardService";
import "./MechanicDashboard.css";

const ACTIVE_STATUSES = new Set([
  "RECEIVED",
  "INSPECTION",
  "IN_REPAIR",
  "QUALITY_CHECK",
]);

const TASK_STATUSES = [
  { value: "PENDING", label: "Pending", color: "pending" },
  { value: "IN_PROGRESS", label: "In progress", color: "in-progress" },
  { value: "COMPLETED", label: "Completed", color: "completed" },
  { value: "CANCELLED", label: "Cancelled", color: "cancelled" },
];

const normalizeStatus = (status) =>
  String(status || "").trim().toUpperCase().replace(/[\s-]+/g, "_");

const isActiveJob = (job) => ACTIVE_STATUSES.has(normalizeStatus(job.status));

const readableStatus = (status) =>
  String(status || "Unknown")
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const statusClass = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "IN_REPAIR") return "repair";
  if (normalized === "QUALITY_CHECK") return "quality";
  if (normalized === "DELIVERED") return "delivered";
  if (normalized === "INSPECTION") return "inspection";
  if (normalized === "RECEIVED") return "received";
  return "";
};

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

const isSameLocalDay = (value, day) => {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toDateString() === day.toDateString();
};

const assignmentDate = (job) => job.assignedDate;

const getErrorMessage = (error, fallback) =>
  error instanceof Error ? error.message : fallback;

const getRequestErrorMessage = (error, fallback, authorizationContext) => {
  const message = getErrorMessage(error, fallback);
  return /\b403\b/.test(message)
    ? `${message} ${authorizationContext}`
    : message;
};

function MechanicDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [jobsState, setJobsState] = useState({ status: "loading", jobs: [] });
  const [tasksState, setTasksState] = useState({ status: "loading", tasks: [] });
  const [alertsState, setAlertsState] = useState({ status: "loading", alerts: [] });

  useEffect(() => {
    let active = true;
    setJobsState({ status: "loading", jobs: [] });
    setTasksState({ status: "loading", tasks: [] });
    setAlertsState({ status: "loading", alerts: [] });

    getDashboardJobCards()
      .then((jobs) => {
        if (active) setJobsState({ status: "success", jobs });
        return jobs;
      })
      .catch((error) => {
        if (active) {
          setJobsState({
            status: "error",
            jobs: [],
            error: getRequestErrorMessage(
              error,
              "Unable to load your assigned jobs.",
              "This endpoint permits MECHANIC and filters jobs through the profile linked to your login."
            ),
          });
        }
      });

    getAssignedJobTasks()
      .then((tasks) => {
        if (active) setTasksState({ status: "success", tasks });
      })
      .catch((error) => {
        if (active) {
          setTasksState({
            status: "error",
            tasks: [],
            error: getRequestErrorMessage(
              error,
              "Unable to load your assigned repair tasks.",
              "This endpoint permits MECHANIC and filters tasks through the profile linked to your login."
            ),
          });
        }
      });

    getDashboardNotifications()
      .then((alerts) => {
        if (active) setAlertsState({ status: "success", alerts });
      })
      .catch((error) => {
        if (active) {
          setAlertsState({
            status: "error",
            alerts: [],
            error: getErrorMessage(error, "Unable to load your notifications."),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const today = new Date();
  const todayLabel = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toUpperCase();
  const jobs = jobsState.status === "success" ? jobsState.jobs : [];
  const activeJobs = jobs.filter(isActiveJob);
  const assignedToday = jobs.filter((job) => isSameLocalDay(assignmentDate(job), today));
  const completedToday = jobs.filter(
    (job) =>
      normalizeStatus(job.status) === "DELIVERED" &&
      isSameLocalDay(job.completedDate, today)
  );
  const pendingTasks = tasksState.tasks.filter(
    (task) => normalizeStatus(task.status) === "PENDING"
  );

  const completionTrend = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - offset);
    completionTrend.push({
      date: day,
      label: day.toLocaleDateString("en-IN", { weekday: "short" }),
      count: jobs.filter(
        (job) =>
          normalizeStatus(job.status) === "DELIVERED" &&
          isSameLocalDay(job.completedDate, day)
      ).length,
    });
  }

  const knownTaskStatuses = new Set(TASK_STATUSES.map((status) => status.value));
  const taskDistribution = TASK_STATUSES.map((status) => ({
    ...status,
    count: tasksState.tasks.filter(
      (task) => normalizeStatus(task.status) === status.value
    ).length,
  }));
  const otherTaskCount = tasksState.tasks.filter(
    (task) => !knownTaskStatuses.has(normalizeStatus(task.status))
  ).length;
  if (otherTaskCount > 0) {
    taskDistribution.push({
      value: "OTHER",
      label: "Other",
      color: "other",
      count: otherTaskCount,
    });
  }

  const assignedJobIds = new Set(jobs.map((job) => String(job.id)));
  const assignedTaskIds = new Set(tasksState.tasks.map((task) => String(task.id)));
  const relatedAlerts = alertsState.status === "success"
    ? alertsState.alerts
      .filter((alert) => {
        const referenceType = normalizeStatus(alert.referenceType);
        const referenceId = String(alert.referenceId);
        if (referenceType === "JOB_CARD" || referenceType === "JOBCARD") {
          return assignedJobIds.has(referenceId);
        }
        if (referenceType === "JOB_TASK" || referenceType === "TASK") {
          return assignedTaskIds.has(referenceId);
        }
        return false;
      })
      .slice(0, 5)
    : [];

  const trendMax = Math.max(...completionTrend.map((day) => day.count), 0);
  const taskTotal = tasksState.tasks.length;
  const refresh = () => setRefreshKey((key) => key + 1);

  return (
    <main className="mechanic-dashboard-page">
      <section className="mechanic-dashboard-heading">
        <div className="mechanic-dashboard-date">TODAY, {todayLabel}</div>
        <h1>Operations Overview</h1>
      </section>

      <section className="mechanic-dashboard-stats" aria-label="My dashboard statistics">
        <StatCard
          label="TODAY'S ASSIGNED JOBS"
          value={jobsState.status === "loading" ? "…" : jobsState.status === "success" ? assignedToday.length : "—"}
          description={jobsState.status === "loading"
            ? "Loading assigned jobs…"
            : jobsState.status === "error"
              ? jobsState.error
              : `${assignedToday.filter(isActiveJob).length} active today`}
          accent
        />
        <StatCard
          label="JOBS COMPLETED TODAY"
          value={jobsState.status === "loading" ? "…" : jobsState.status === "success" ? completedToday.length : "—"}
          description={jobsState.status === "loading"
            ? "Loading completion data…"
            : jobsState.status === "error"
              ? jobsState.error
              : "Assigned to your mechanic profile"}
        />
        <StatCard
          label="MY PENDING REPAIR TASKS"
          value={tasksState.status === "loading" ? "…" : tasksState.status === "success" ? pendingTasks.length : "—"}
          description={tasksState.status === "loading"
            ? "Loading your repair tasks…"
            : tasksState.status === "error"
              ? tasksState.error
              : "Tasks waiting to start"}
        />
        <StatCard
          label="PARTS FOR MY ASSIGNED JOBS"
          value="—"
          description="Job-specific parts requirements are not available"
        />
      </section>

      <section className="mechanic-dashboard-middle">
        <div className="mechanic-dashboard-panel mechanic-dashboard-jobs">
          <div className="mechanic-dashboard-panel-title">
            <span>ACTIVE JOB CARDS</span>
            <button
              type="button"
              className="mechanic-dashboard-refresh"
              onClick={refresh}
              disabled={jobsState.status === "loading"}
            >
              {jobsState.status === "loading" ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <div className="mechanic-dashboard-table-wrapper" aria-live="polite">
            <table className="mechanic-dashboard-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>REPAIR</th>
                  <th>STATUS</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {jobsState.status === "loading" ? (
                  <tr><td colSpan="6" className="mechanic-dashboard-state">Loading your assigned job cards…</td></tr>
                ) : jobsState.status === "error" ? (
                  <tr><td colSpan="6" className="mechanic-dashboard-state error" role="alert">{jobsState.error}</td></tr>
                ) : activeJobs.length === 0 ? (
                  <tr><td colSpan="6" className="mechanic-dashboard-state">No active job cards are currently assigned to you.</td></tr>
                ) : activeJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="mechanic-dashboard-job-id">
                      <Link to={`/job-cards/${job.id}`}>{job.jobCardNumber || `JC-${job.id}`}</Link>
                    </td>
                    <td className="mechanic-dashboard-customer">{job.customerName || "—"}</td>
                    <td className="mechanic-dashboard-vehicle">{job.vehicleInfo || "—"}</td>
                    <td className="mechanic-dashboard-repair">{job.serviceType || "—"}</td>
                    <td><span className={`mechanic-dashboard-status ${statusClass(job.status)}`}>{readableStatus(job.status)}</span></td>
                    <td className="mechanic-dashboard-eta">{formatDateTime(job.estimatedDelivery)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="mechanic-dashboard-right">
          <section className="mechanic-dashboard-panel mechanic-dashboard-workload">
            <div className="mechanic-dashboard-panel-title">MY WORKLOAD</div>
            <div className="mechanic-dashboard-workload-content">
              <div className="mechanic-dashboard-workload-metric">
                <span>Active assigned jobs</span>
                <strong>
                  {jobsState.status === "loading" ? "…" : jobsState.status === "success" ? activeJobs.length : "—"}
                </strong>
              </div>
              <div className="mechanic-dashboard-workload-metric">
                <span>Pending repair tasks</span>
                <strong>
                  {tasksState.status === "loading" ? "…" : tasksState.status === "success" ? pendingTasks.length : "—"}
                </strong>
              </div>
              <p>
                {jobsState.status === "error" || tasksState.status === "error"
                  ? jobsState.error || tasksState.error
                  : "Capacity and shift targets are not provided by the current APIs."}
              </p>
            </div>
          </section>

          <section className="mechanic-dashboard-panel mechanic-dashboard-alerts">
            <div className="mechanic-dashboard-panel-title">ALERTS FOR MY JOBS</div>
            <div className="mechanic-dashboard-alert-list" aria-live="polite">
              {alertsState.status === "loading" ? (
                <div className="mechanic-dashboard-empty">Loading your alerts…</div>
              ) : alertsState.status === "error" ? (
                <div className="mechanic-dashboard-empty error" role="alert">{alertsState.error}</div>
              ) : jobsState.status === "loading" || tasksState.status === "loading" ? (
                <div className="mechanic-dashboard-empty">Checking alerts for your assigned jobs…</div>
              ) : jobsState.status === "error" || tasksState.status === "error" ? (
                <div className="mechanic-dashboard-empty error" role="alert">
                  {jobsState.error || tasksState.error}
                </div>
              ) : relatedAlerts.length === 0 ? (
                <div className="mechanic-dashboard-empty">Job-linked alerts are unavailable from current notification sources.</div>
              ) : relatedAlerts.map((alert) => (
                <article className="mechanic-dashboard-alert" key={alert.id}>
                  <span className="mechanic-dashboard-alert-icon" aria-hidden="true">
                    {alert.read ? "·" : "!"}
                  </span>
                  <div>
                    <strong>{alert.title || "—"}</strong>
                    <span>{alert.message || "—"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="mechanic-dashboard-bottom">
        <section className="mechanic-dashboard-panel mechanic-dashboard-trend">
          <div className="mechanic-dashboard-panel-title">MY JOB COMPLETION TREND · LAST 7 DAYS</div>
          {jobsState.status === "loading" ? (
            <div className="mechanic-dashboard-empty">Loading your completion history…</div>
          ) : jobsState.status === "error" ? (
            <div className="mechanic-dashboard-empty error" role="alert">{jobsState.error}</div>
          ) : trendMax === 0 ? (
            <div className="mechanic-dashboard-empty">No assigned jobs were completed in the last 7 days.</div>
          ) : (
            <div className="mechanic-dashboard-chart">
              <div className="mechanic-dashboard-chart-area" role="img" aria-label="Completed assigned jobs by day for the last seven days">
                {completionTrend.map((day) => (
                  <div className="mechanic-dashboard-chart-column" key={day.date.toISOString()}>
                    <span className="mechanic-dashboard-chart-count">{day.count || ""}</span>
                    <div className="mechanic-dashboard-chart-track">
                      <div
                        className="mechanic-dashboard-chart-bar"
                        style={{ height: `${day.count === 0 ? 0 : Math.max((day.count / trendMax) * 100, 8)}%` }}
                        title={`${day.count} completed`}
                      />
                    </div>
                    <span className="mechanic-dashboard-chart-day">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mechanic-dashboard-panel mechanic-dashboard-distribution">
          <div className="mechanic-dashboard-panel-title">MY REPAIR TASK DISTRIBUTION</div>
          {tasksState.status === "loading" ? (
            <div className="mechanic-dashboard-empty">Loading your assigned tasks…</div>
          ) : tasksState.status === "error" ? (
            <div className="mechanic-dashboard-empty error" role="alert">{tasksState.error}</div>
          ) : taskTotal === 0 ? (
            <div className="mechanic-dashboard-empty">No repair tasks are assigned to you.</div>
          ) : (
            <div className="mechanic-dashboard-distribution-list">
              {taskDistribution.map((item) => (
                <div className="mechanic-dashboard-distribution-row" key={item.value}>
                  <div className="mechanic-dashboard-distribution-info">
                    <strong>{item.label}</strong>
                    <span>{item.count}</span>
                  </div>
                  <div className="mechanic-dashboard-distribution-track">
                    <div
                      className={`mechanic-dashboard-distribution-fill ${item.color}`}
                      style={{ width: `${(item.count / taskTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value, description, accent = false }) {
  return (
    <article className="mechanic-dashboard-stat-card">
      <div className="mechanic-dashboard-stat-label">{label}</div>
      <div className={`mechanic-dashboard-stat-value${accent ? " lime" : ""}`}>{value}</div>
      <div className="mechanic-dashboard-stat-description">{description}</div>
    </article>
  );
}

export default MechanicDashboard;
