import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobCard, updateJobCard } from "../../services/jobCardService";
import "./JobCardDetailsPage.css";

const STATUS_STEPS = ["RECEIVED", "INSPECTION", "IN_REPAIR", "QUALITY_CHECK", "DELIVERED"];
const STATUS_LABELS = { RECEIVED: "Received", INSPECTION: "Inspection", IN_REPAIR: "In Repair", QUALITY_CHECK: "Quality Check", DELIVERED: "Delivered" };
const STATUS_CLASS = { RECEIVED: "details-status-received", INSPECTION: "details-status-inspection", IN_REPAIR: "details-status-repair", QUALITY_CHECK: "details-status-qc", DELIVERED: "details-status-delivered" };

function JobCardDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getJobCard(jobId)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  const advanceStatus = async () => {
    const idx = STATUS_STEPS.indexOf(job.status);
    if (idx === -1 || idx === STATUS_STEPS.length - 1) return;
    const nextStatus = STATUS_STEPS[idx + 1];
    setUpdating(true);
    try {
      const updated = await updateJobCard(job.id, {
        customerId: job.customerId,
        vehicleId: job.vehicleId,
        mechanicId: job.mechanicId,
        serviceType: job.serviceType,
        complaint: job.complaint,
        technicianNotes: job.technicianNotes,
        odometerReading: job.odometerReading,
        estimatedDelivery: job.estimatedDelivery,
        estimatedCost: job.estimatedCost,
        status: nextStatus,
      });
      setJob(updated);
    } finally {
      setUpdating(false);
    }
  };

  const Sidebar = () => (
    <aside className="job-details-sidebar">
      <div className="job-details-logo">
        <div className="job-details-logo-icon">▰</div>
        <span>Auto_Service_Hub</span>
      </div>
      <nav className="job-details-nav">
        <Link to="/mechanic-dashboard" className="job-details-nav-item"><span>▦</span> Dashboard</Link>
        <Link to="/job-cards" className="job-details-nav-item active"><span>♧</span> Job Cards</Link>
      </nav>
    </aside>
  );

  if (loading) {
    return (
      <div className="job-details-page">
        <Sidebar />
        <main className="job-details-main"><div className="job-details-not-found"><h1>Loading...</h1></div></main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <Sidebar />
        <main className="job-details-main">
          <div className="job-details-not-found">
            <h1>JOB CARD NOT FOUND</h1>
            <p>The requested job card could not be found.</p>
            <Link to="/job-cards" className="job-details-back-button">← BACK TO JOB CARDS</Link>
          </div>
        </main>
      </div>
    );
  }

  const progressStep = STATUS_STEPS.indexOf(job.status) + 1;
  const isLastStep = job.status === "DELIVERED";

  return (
    <div className="job-details-page">
      <Sidebar />

      <main className="job-details-main">
        <header className="job-details-topbar">
          <div className="job-details-breadcrumb">
            <span>Auto_Service_Hub</span><b>/</b><span>Jobcards</span><b>/</b>
            <strong>{job.jobCardNumber}</strong>
          </div>
          <div className="job-details-top-actions">
            <span className="job-details-role">MECHANIC</span>
            <Link to="/" className="job-details-user" title="Home">⌂</Link>
          </div>
        </header>

        <section className="job-details-content">

          <div className="job-details-heading">
            <div>
              <div className="job-details-label">— JOB CARD</div>
              <h1>{job.jobCardNumber}</h1>
              <p>Created job card and service information.</p>
            </div>
            <Link to="/job-cards" className="job-details-back">← BACK TO JOB CARDS</Link>
          </div>

          <div className="job-details-status-card">
            <div>
              <span className="details-small-label">CURRENT STATUS</span>
              <span className={`details-status ${STATUS_CLASS[job.status] ?? ""}`}>
                {STATUS_LABELS[job.status] ?? job.status}
              </span>
            </div>
            <div className="job-details-eta">
              <span>EXPECTED DELIVERY</span>
              <strong>
                {job.estimatedDelivery
                  ? new Date(job.estimatedDelivery).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                  : "—"}
              </strong>
            </div>
            <div className="job-details-total">
              <span>ESTIMATED AMOUNT</span>
              <strong>{job.estimatedCost ? `₹${Number(job.estimatedCost).toLocaleString("en-IN")}` : "—"}</strong>
            </div>
          </div>

          <div className="job-details-section">
            <div className="job-details-section-title">JOB PROGRESS</div>
            <div className="details-progress">
              <div className="details-progress-bars">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className={step <= progressStep ? "details-progress-bar completed" : "details-progress-bar"}></div>
                ))}
              </div>
              <div className="details-progress-labels">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s}><strong>0{i + 1}</strong><span>{STATUS_LABELS[s]}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="job-details-grid">
            <div className="job-details-section">
              <div className="job-details-section-title">CUSTOMER INFORMATION</div>
              <div className="details-info-list">
                <div className="details-info-row"><span>CUSTOMER</span><strong>{job.customerName}</strong></div>
              </div>
            </div>

            <div className="job-details-section">
              <div className="job-details-section-title">VEHICLE INFORMATION</div>
              <div className="details-info-list">
                <div className="details-info-row"><span>VEHICLE</span><strong>{job.vehicleInfo}</strong></div>
                <div className="details-info-row"><span>ODOMETER</span><strong>{job.odometerReading ? `${job.odometerReading} km` : "—"}</strong></div>
              </div>
            </div>

            <div className="job-details-section">
              <div className="job-details-section-title">ASSIGNED MECHANIC</div>
              <div className="details-mechanic">
                <div className="details-mechanic-icon">🔧</div>
                <div>
                  <strong>{job.mechanicName ?? "Unassigned"}</strong>
                  <span>Technician</span>
                </div>
              </div>
            </div>

            <div className="job-details-section">
              <div className="job-details-section-title">SERVICE DETAILS</div>
              <div className="details-info-list">
                <div className="details-info-row"><span>SERVICE</span><strong>{job.serviceType}</strong></div>
                <div className="details-info-row"><span>AMOUNT</span><strong className="details-green">{job.estimatedCost ? `₹${Number(job.estimatedCost).toLocaleString("en-IN")}` : "—"}</strong></div>
              </div>
            </div>
          </div>

          {job.complaint && (
            <div className="job-details-section">
              <div className="job-details-section-title">CUSTOMER COMPLAINT</div>
              <div className="details-description">{job.complaint}</div>
            </div>
          )}

          {job.technicianNotes && (
            <div className="job-details-section">
              <div className="job-details-section-title">TECHNICIAN NOTES</div>
              <div className="details-description">{job.technicianNotes}</div>
            </div>
          )}

          <div className="job-details-actions">
            <Link to="/job-cards" className="details-secondary-button">← BACK</Link>
            {!isLastStep && (
              <button className="details-primary-button" onClick={advanceStatus} disabled={updating}>
                {updating ? "UPDATING..." : `ADVANCE TO ${STATUS_LABELS[STATUS_STEPS[STATUS_STEPS.indexOf(job.status) + 1]]} →`}
              </button>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}

export default JobCardDetailsPage;
