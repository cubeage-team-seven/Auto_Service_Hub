import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobCards } from "../../services/jobCardService";
import "./JobCardListPage.css";

function JobCardListPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getJobCards(0, 50)
      .then((page) => setJobs(page.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // =========================================================
  // FILTERS
  // =========================================================

  const filters = ["ALL", "RECEIVED", "INSPECTION", "REPAIR", "QC", "DELIVERED"];

  // =========================================================
  // FILTER JOBS
  // =========================================================

  const filteredJobs =
    activeFilter === "ALL"
      ? jobs
      : jobs.filter((job) => {
          if (activeFilter === "REPAIR") return job.status === "IN_REPAIR";
          if (activeFilter === "QC") return job.status === "QUALITY_CHECK";
          return job.status === activeFilter;
        });

  const statusLabel = (s) => {
    const map = { RECEIVED: "Received", INSPECTION: "Inspection", IN_REPAIR: "In Repair", QUALITY_CHECK: "Quality Check", DELIVERED: "Delivered" };
    return map[s] ?? s;
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "IN_REPAIR": return "status-repair";
      case "QUALITY_CHECK": return "status-qc";
      case "DELIVERED": return "status-delivered";
      case "INSPECTION": return "status-inspection";
      case "RECEIVED": return "status-received";
      default: return "";
    }
  };

  return (
    <div
      className={`jobcard-page ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="jobcard-sidebar">

        {/* LOGO */}

        <div className="jobcard-logo">

          <div className="jobcard-logo-icon">
            ▰
          </div>

          <span className="jobcard-logo-text">
            Auto_Service_Hub
          </span>

        </div>


        {/* NAVIGATION */}

        <nav className="jobcard-sidebar-nav">

          {/* DASHBOARD */}

          <Link
            to="/mechanic-dashboard"
            className="jobcard-nav-item"
          >

            <span className="jobcard-nav-icon">
              ▦
            </span>

            <span className="jobcard-nav-text">
              Dashboard
            </span>

          </Link>


          {/* JOB CARDS */}

          <Link
            to="/job-cards"
            className="jobcard-nav-item active"
          >

            <span className="jobcard-nav-icon">
              ♧
            </span>

            <span className="jobcard-nav-text">
              Job Cards
            </span>

          </Link>

        </nav>

      </aside>


      {/* =====================================================
          SIDEBAR TOGGLE
      ===================================================== */}

      <button
        type="button"
        className={`sidebar-toggle ${
          sidebarOpen ? "toggle-open" : "toggle-closed"
        }`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "‹" : "›"}
      </button>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="jobcard-main">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="jobcard-topbar">

          {/* BREADCRUMB */}

          <div className="jobcard-breadcrumb">

            <span>
              Auto_Service_Hub
            </span>

            <b>
              /
            </b>

            <strong>
              Jobcards
            </strong>

          </div>


          {/* TOP RIGHT */}

          <div className="jobcard-top-actions">

            {/* ROLE */}

            <span className="jobcard-role">
              MECHANIC
            </span>


            {/* AI ALERT */}

            <span className="jobcard-alert">
              <i></i>
              3 AI alerts
            </span>


            {/* MAIN DASHBOARD BUTTON */}

            <Link
                to="/"
                className="jobcard-user-button"
                aria-label="Go to Main Page"
                title="Go to Main Page"
                >
                ⌂
            </Link>

          </div>

        </header>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="jobcard-content">

          {/* HEADING */}

          <div className="jobcard-heading-row">

            <h1>
              JOB CARDS
            </h1>

            <Link
              to="/job-cards/create"
              className="new-job-card-button"
            >
              + NEW JOB CARD
            </Link>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="jobcard-stats">

            <div className="jobcard-stat-card">

              <span>
                TOTAL TODAY
              </span>

              <strong>
                14
              </strong>

            </div>


            <div className="jobcard-stat-card">

              <span>
                IN REPAIR
              </span>

              <strong className="green-number">
                4
              </strong>

            </div>


            <div className="jobcard-stat-card">

              <span>
                QC
              </span>

              <strong>
                2
              </strong>

            </div>


            <div className="jobcard-stat-card">

              <span>
                DELIVERED
              </span>

              <strong>
                6
              </strong>

            </div>


            <div className="jobcard-stat-card">

              <span>
                OVERDUE
              </span>

              <strong>
                1
              </strong>

            </div>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="jobcard-filters">

            {filters.map((filter) => (

              <button
                key={filter}
                type="button"
                className={
                  activeFilter === filter
                    ? "jobcard-filter active"
                    : "jobcard-filter"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>

            ))}

          </div>


          {/* =================================================
              JOB LIST
          ================================================= */}

          <div className="jobcard-list">

            {loading && <div className="jobcard-empty">Loading...</div>}

            {!loading && filteredJobs.map((job) => (

              <div
                className="jobcard-item"
                key={job.id}
              >

                {/* TOP INFORMATION */}

                <div className="jobcard-item-top">

                  {/* CUSTOMER */}

                  <div className="jobcard-customer">

                    <span className="jobcard-id">
                      {job.jobCardNumber}
                    </span>

                    <h2>
                      {job.customerName}
                    </h2>

                    <p>
                      {job.vehicleInfo}
                    </p>

                  </div>


                  {/* SERVICE */}

                  <div className="jobcard-service">

                    <span>
                      Service
                    </span>

                    <strong>
                      {job.serviceType}
                    </strong>

                    <p>
                      Mechanic: {job.mechanicName ?? "Unassigned"}
                    </p>

                  </div>


                  {/* STATUS */}

                  <div className="jobcard-status-area">

                    <span
                      className={`jobcard-status ${getStatusClass(job.status)}`}
                    >
                      {statusLabel(job.status)}
                    </span>

                  </div>


                  {/* AMOUNT */}

                  <div className="jobcard-amount-area">

                    <span>
                      {job.estimatedDelivery ? new Date(job.estimatedDelivery).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </span>

                    <strong>
                      {job.estimatedCost ? `₹${Number(job.estimatedCost).toLocaleString("en-IN")}` : "—"}
                    </strong>

                  </div>


                  {/* DETAILS */}

                  <Link
                    to={`/job-cards/${job.id}`}
                    className="jobcard-details-button"
                  >
                    Details
                  </Link>

                </div>


                {/* =================================================
                    PROGRESS
                ================================================= */}

                <div className="jobcard-progress">

                  <div className="jobcard-progress-bars">

                    {[1, 2, 3, 4, 5].map((step) => (

                      <div
                        key={step}
                        className={
                          step <= job.progress
                            ? "progress-bar completed"
                            : "progress-bar"
                        }
                      ></div>

                    ))}

                  </div>


                  <div className="jobcard-progress-labels">

                    <span>
                      Received
                    </span>

                    <span>
                      Inspection
                    </span>

                    <span>
                      In Repair
                    </span>

                    <span>
                      QC
                    </span>

                    <span>
                      Delivered
                    </span>

                  </div>

                </div>

              </div>

            ))}


            {/* EMPTY RESULT */}

            {filteredJobs.length === 0 && (

              <div className="jobcard-empty">
                No job cards found.
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobCardListPage;