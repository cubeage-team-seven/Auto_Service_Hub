import React, { useEffect, useState } from "react";
import { dashboardApi, jobCardsApi, mechanicsApi, partsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerDashboard.css";

function GarageOwnerDashboard() {
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      dashboardApi.summary(),
      jobCardsApi.list(),
      mechanicsApi.list(),
      partsApi.lowStock(),
    ])
      .then(([dashboardSummary, jobRecords, mechanicRecords, lowStockRecords]) => {
        setSummary(dashboardSummary);
        setJobs(jobRecords);
        setMechanics(mechanicRecords);
        setLowStockParts(lowStockRecords);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const statusLabels = {
    RECEIVED: "Received",
    INSPECTION: "Inspection",
    IN_REPAIR: "In Repair",
    QUALITY_CHECK: "Quality Check",
    DELIVERED: "Delivered",
  };
  const statusClasses = {
    RECEIVED: "received",
    INSPECTION: "inspection",
    IN_REPAIR: "repair",
    QUALITY_CHECK: "quality",
    DELIVERED: "delivered",
  };
  const activeJobCount = jobs.filter((job) => job.status !== "DELIVERED").length;
  const serviceCounts = jobs.reduce((counts, job) => {
    const service = job.serviceType || "Unspecified";
    counts[service] = (counts[service] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="garage-dashboard-page">

      {/* ================= PAGE HEADING ================= */}

      <section className="garage-dashboard-heading">
        <div className="garage-dashboard-date">
          — TODAY, {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
        </div>

        <h1>OPERATIONS OVERVIEW</h1>
      </section>


      {/* ================= STAT CARDS ================= */}

      {error && <p role="alert" className="login-error">{error}</p>}

      <section className="garage-dashboard-stats">

        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            TODAY'S JOBS
          </div>

          <div className="garage-dashboard-stat-value lime">
            {summary?.todaysJobs ?? (loading ? "…" : "—")}
          </div>

          <div className="garage-dashboard-stat-description">
            {summary ? `${summary.pendingJobs} active · ${summary.completedJobs} delivered` : "Awaiting data"}
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            REVENUE TODAY
          </div>

          <div className="garage-dashboard-stat-value">
            {summary ? `₹${Number(summary.revenue || 0).toLocaleString("en-IN")}` : loading ? "…" : "—"}
          </div>

          <div className="garage-dashboard-stat-description">
            Today's recorded revenue
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            UPCOMING APPOINTMENTS
          </div>

          <div className="garage-dashboard-stat-value">
            {summary?.upcomingAppointments ?? (loading ? "…" : "—")}
          </div>

          <div className="garage-dashboard-stat-description">
            Scheduled appointments
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            LOW STOCK ALERTS
          </div>

          <div className="garage-dashboard-stat-value">
            {summary?.lowStockParts ?? (loading ? "…" : "—")}
          </div>

          <div className="garage-dashboard-stat-description">
            Parts at or below reorder level
          </div>
        </div>

      </section>


      {/* ================= MIDDLE SECTION ================= */}

      <section className="garage-dashboard-middle">

        {/* ================= ACTIVE JOB CARDS ================= */}

        <div className="garage-dashboard-panel garage-dashboard-jobs">

          <div className="garage-dashboard-panel-title">
            ACTIVE JOB CARDS
          </div>

          <div className="garage-dashboard-table-wrapper">

            <table className="garage-dashboard-table">

              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>MECHANIC</th>
                  <th>STATUS</th>
                  <th>ETA</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>

              <tbody>

                {loading && <tr><td colSpan="7">Loading recent job cards…</td></tr>}
                {!loading && error && <tr><td colSpan="7" role="alert">{error}</td></tr>}
                {jobs.map((job) => (
                  <tr key={job.id}>

                    <td className="garage-dashboard-job-id">
                      {job.jobCardNumber}
                    </td>

                    <td className="garage-dashboard-customer">
                      {job.customerName}
                    </td>

                    <td className="garage-dashboard-vehicle">
                      {job.vehicleInfo}
                    </td>

                    <td className="garage-dashboard-mechanic">
                      {job.mechanicName || "Unassigned"}
                    </td>

                    <td>
                      <span
                        className={`garage-dashboard-status ${statusClasses[job.status] || ""}`}
                      >
                        {statusLabels[job.status] || job.status}
                      </span>
                    </td>

                    <td className="garage-dashboard-eta">
                      {job.estimatedDelivery
                        ? new Date(job.estimatedDelivery).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
                        : "—"}
                    </td>

                    <td className="garage-dashboard-amount">
                      {job.estimatedCost == null ? "—" : `₹${Number(job.estimatedCost).toLocaleString("en-IN")}`}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* ================= RIGHT COLUMN ================= */}

        <div className="garage-dashboard-right">

          {/* ================= MECHANIC WORKLOAD ================= */}

          <div className="garage-dashboard-panel garage-dashboard-workload">

            <div className="garage-dashboard-panel-title">
              MECHANIC WORKLOAD
            </div>

            <div className="garage-dashboard-mechanics">

              {mechanics.map((mechanic) => (
                <div className="garage-dashboard-mechanic-row" key={mechanic.id}>
                  {(() => {
                    const activeCount = jobs.filter((job) => job.mechanicId === mechanic.id && job.status !== "DELIVERED").length;
                    return (
                      <>

                  <div className="garage-dashboard-mechanic-person">

                    <span
                      className={`garage-dashboard-mechanic-dot ${activeCount ? "busy" : "available"}`}
                    ></span>

                    <span>
                      {mechanic.name}
                    </span>

                  </div>

                  <span className="garage-dashboard-active-count">
                    {activeCount} active
                  </span>

                      </>
                    );
                  })()}
                </div>
              ))}

            </div>

          </div>


          {/* ================= AI ALERTS ================= */}

          <div className="garage-dashboard-panel garage-dashboard-ai">

            <div className="garage-dashboard-panel-title">LOW STOCK PARTS</div>

            <div className="garage-dashboard-alert-list">
              {lowStockParts.map((part) => (
                <div className="garage-dashboard-alert" key={part.id}>
                  <div className="garage-dashboard-alert-icon">!</div>
                  <div>
                    <strong>{part.name}</strong>
                    <span>{part.stockQty} in stock · reorder at {part.minStock}</span>
                  </div>
                </div>
              ))}
              {!loading && !error && lowStockParts.length === 0 && <p>No low-stock parts.</p>}
            </div>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM SECTION ================= */}

      <section className="garage-dashboard-bottom">

        {/* ================= SERVICE DISTRIBUTION ================= */}

        <div className="garage-dashboard-panel garage-dashboard-service">

          <div className="garage-dashboard-panel-title">
            SERVICE DISTRIBUTION
          </div>

          <div className="garage-dashboard-service-list">

            {Object.entries(serviceCounts).map(([service, count]) => (
              <div className="garage-dashboard-service-row" key={service}>
                <div className="garage-dashboard-service-info">
                  <strong>{service}</strong>
                  <span>{count} jobs</span>
                </div>
                <div className="garage-dashboard-service-bar">
                  <div
                    className="garage-dashboard-service-fill full"
                    style={{ width: `${jobs.length ? (count / jobs.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {!loading && !error && Object.keys(serviceCounts).length === 0 && <p>No job cards recorded.</p>}

          </div>

        </div>

      </section>

    </div>
  );
}

export default GarageOwnerDashboard;