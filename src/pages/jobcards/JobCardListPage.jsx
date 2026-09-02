import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./JobCardListPage.css";

function JobCardListPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [savedJobs, setSavedJobs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedJobs =
      JSON.parse(localStorage.getItem("smartgarage_jobcards")) || [];

    setSavedJobs(storedJobs);
  }, []);

  // =========================================================
  // DEFAULT JOBS
  // =========================================================

  const jobs = [
    {
      id: "JC-2408",
      customer: "Arjun Mehta",
      vehicle: "MH-12-AB-4521 | Swift",
      service: "Engine Overhaul",
      mechanic: "Ravi Kumar",
      status: "In Repair",
      eta: "Today 5:00 PM",
      amount: "₹18,500",
      progress: 3,
    },

    {
      id: "JC-2407",
      customer: "Priya Sharma",
      vehicle: "DL-01-CZ-9834 | Creta",
      service: "Full Service",
      mechanic: "Amit Patel",
      status: "Quality Check",
      eta: "Today 3:30 PM",
      amount: "₹8,200",
      progress: 4,
    },

    {
      id: "JC-2406",
      customer: "Rohit Desai",
      vehicle: "GJ-05-XY-7712 | Innova",
      service: "AC Repair + Service",
      mechanic: "Suresh Nair",
      status: "Delivered",
      eta: "Delivered",
      amount: "₹12,400",
      progress: 5,
    },

    {
      id: "JC-2405",
      customer: "Neha Joshi",
      vehicle: "MH-14-PQ-3356 | City",
      service: "Brake Replacement",
      mechanic: "Ravi Kumar",
      status: "Inspection",
      eta: "Today 6:00 PM",
      amount: "₹4,800",
      progress: 2,
    },

    {
      id: "JC-2404",
      customer: "Vikram Singh",
      vehicle: "UP-32-GH-1190 | Fortuner",
      service: "Suspension + Tyres",
      mechanic: "Amit Patel",
      status: "Received",
      eta: "Tomorrow 12:00 PM",
      amount: "₹32,000",
      progress: 1,
    },

    {
      id: "JC-2403",
      customer: "Kavita Rao",
      vehicle: "KA-03-MN-5567 | Baleno",
      service: "Basic Service",
      mechanic: "Deepak Verma",
      status: "Delivered",
      eta: "Delivered",
      amount: "₹3,200",
      progress: 5,
    },
  ];

  // =========================================================
  // FILTERS
  // =========================================================

  const filters = [
    "ALL",
    "RECEIVED",
    "INSPECTION",
    "REPAIR",
    "QC",
    "DELIVERED",
  ];

  // =========================================================
  // ALL JOBS
  // =========================================================

  const allJobs = [
    ...jobs,
    ...savedJobs,
  ];

  // =========================================================
  // FILTER JOBS
  // =========================================================

  const filteredJobs =
    activeFilter === "ALL"
      ? allJobs
      : allJobs.filter((job) => {
          if (activeFilter === "REPAIR") {
            return job.status === "In Repair";
          }

          if (activeFilter === "QC") {
            return job.status === "Quality Check";
          }

          return job.status.toUpperCase() === activeFilter;
        });

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "In Repair":
        return "status-repair";

      case "Quality Check":
        return "status-qc";

      case "Delivered":
        return "status-delivered";

      case "Inspection":
        return "status-inspection";

      case "Received":
        return "status-received";

      default:
        return "";
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

            {filteredJobs.map((job) => (

              <div
                className="jobcard-item"
                key={job.id}
              >

                {/* TOP INFORMATION */}

                <div className="jobcard-item-top">

                  {/* CUSTOMER */}

                  <div className="jobcard-customer">

                    <span className="jobcard-id">
                      {job.id}
                    </span>

                    <h2>
                      {job.customer}
                    </h2>

                    <p>
                      {job.vehicle}
                    </p>

                  </div>


                  {/* SERVICE */}

                  <div className="jobcard-service">

                    <span>
                      Service
                    </span>

                    <strong>
                      {job.service}
                    </strong>

                    <p>
                      Mechanic: {job.mechanic}
                    </p>

                  </div>


                  {/* STATUS */}

                  <div className="jobcard-status-area">

                    <span
                      className={`jobcard-status ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>

                  </div>


                  {/* AMOUNT */}

                  <div className="jobcard-amount-area">

                    <span>
                      {job.eta}
                    </span>

                    <strong>
                      {job.amount}
                    </strong>

                  </div>


                  {/* DETAILS */}

                  <Link
                    to={`/job-cards/${job.id}`}
                    state={{ job }}
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