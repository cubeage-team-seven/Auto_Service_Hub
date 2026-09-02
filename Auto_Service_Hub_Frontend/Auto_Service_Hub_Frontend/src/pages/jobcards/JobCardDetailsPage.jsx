import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./JobCardDetailsPage.css";

function JobCardDetailsPage() {
  const { jobId } = useParams();
  const location = useLocation();

  const passedJob = location.state?.job;

  const savedJobs =
    JSON.parse(localStorage.getItem("smartgarage_jobcards")) || [];

  const defaultJobs = [
    {
      id: "JC-2408",
      customer: "Arjun Mehta",
      phone: "+91 98765 43210",
      vehicle: "MH-12-AB-4521 | Swift",
      service: "Engine Overhaul",
      mechanic: "Ravi Kumar",
      status: "In Repair",
      eta: "Today 5:00 PM",
      amount: "₹18,500",
      progress: 3,
      description:
        "Engine noise reported by customer. Complete engine inspection and overhaul required.",
    },
    {
      id: "JC-2407",
      customer: "Priya Sharma",
      phone: "+91 98765 43120",
      vehicle: "DL-01-CZ-9834 | Creta",
      service: "Full Service",
      mechanic: "Amit Patel",
      status: "Quality Check",
      eta: "Today 3:30 PM",
      amount: "₹8,200",
      progress: 4,
      description:
        "Periodic full service including engine oil, filters, brakes and general inspection.",
    },
  ];

  const allJobs = [
    ...defaultJobs,
    ...savedJobs,
  ];

  const job =
    passedJob ||
    allJobs.find((item) => item.id === jobId);


  /* =====================================================
     JOB NOT FOUND
  ===================================================== */

  if (!job) {
    return (
      <div className="job-details-page">

        <aside className="job-details-sidebar">

          <div className="job-details-logo">
            <div className="job-details-logo-icon">
              ▰
            </div>

            <span>
              Auto_Service_Hub
            </span>
          </div>

          <nav className="job-details-nav">

            <Link
              to="/mechanic-dashboard"
              className="job-details-nav-item"
            >
              <span>▦</span>
              Dashboard
            </Link>

            <Link
              to="/job-cards"
              className="job-details-nav-item active"
            >
              <span>♧</span>
              Job Cards
            </Link>

          </nav>

        </aside>

        <main className="job-details-main">

          <div className="job-details-not-found">

            <h1>
              JOB CARD NOT FOUND
            </h1>

            <p>
              The requested job card could not be found.
            </p>

            <Link
              to="/job-cards"
              className="job-details-back-button"
            >
              ← BACK TO JOB CARDS
            </Link>

          </div>

        </main>

      </div>
    );
  }


  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = () => {

    switch (job.status) {

      case "Received":
        return "details-status-received";

      case "Inspection":
        return "details-status-inspection";

      case "In Repair":
        return "details-status-repair";

      case "Quality Check":
        return "details-status-qc";

      case "Delivered":
        return "details-status-delivered";

      default:
        return "";
    }
  };


  return (
    <div className="job-details-page">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="job-details-sidebar">

        <div className="job-details-logo">

          <div className="job-details-logo-icon">
            ▰
          </div>

          <span>
            Auto_Service_Hub
          </span>

        </div>


        <nav className="job-details-nav">

          <Link
            to="/mechanic-dashboard"
            className="job-details-nav-item"
          >
            <span>
              ▦
            </span>

            Dashboard
          </Link>


          <Link
            to="/job-cards"
            className="job-details-nav-item active"
          >
            <span>
              ♧
            </span>

            Job Cards
          </Link>

        </nav>


        <div className="job-details-sidebar-bottom">
          ‹
        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="job-details-main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="job-details-topbar">

          <div className="job-details-breadcrumb">

            <span>
              Auto_Service_Hub
            </span>

            <b>
              /
            </b>

            <span>
              Jobcards
            </span>

            <b>
              /
            </b>

            <strong>
              {job.id}
            </strong>

          </div>


          <div className="job-details-top-actions">

            <span className="job-details-role">
              MECHANIC
            </span>

            <span className="job-details-alert">
              <i></i>
              3 AI alerts
            </span>

            <button
              type="button"
              className="job-details-user"
              onClick={() => navigate("/")}
              title="Home"
            >
              ⌂
            </button>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="job-details-content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="job-details-heading">

            <div>

              <div className="job-details-label">
                — JOB CARD
              </div>

              <h1>
                {job.id}
              </h1>

              <p>
                Created job card and service information.
              </p>

            </div>


            <Link
              to="/job-cards"
              className="job-details-back"
            >
              ← BACK TO JOB CARDS
            </Link>

          </div>


          {/* =================================================
              STATUS HEADER
          ================================================= */}

          <div className="job-details-status-card">

            <div>

              <span className="details-small-label">
                CURRENT STATUS
              </span>

              <span
                className={`details-status ${getStatusClass()}`}
              >
                {job.status}
              </span>

            </div>


            <div className="job-details-eta">

              <span>
                EXPECTED DELIVERY
              </span>

              <strong>
                {job.eta}
              </strong>

            </div>


            <div className="job-details-total">

              <span>
                ESTIMATED AMOUNT
              </span>

              <strong>
                {job.amount}
              </strong>

            </div>

          </div>


          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="job-details-section">

            <div className="job-details-section-title">
              JOB PROGRESS
            </div>


            <div className="details-progress">

              <div className="details-progress-bars">

                {[1, 2, 3, 4, 5].map((step) => (

                  <div
                    key={step}
                    className={
                      step <= job.progress
                        ? "details-progress-bar completed"
                        : "details-progress-bar"
                    }
                  ></div>

                ))}

              </div>


              <div className="details-progress-labels">

                <div>
                  <strong>01</strong>
                  <span>Received</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Inspection</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>In Repair</span>
                </div>

                <div>
                  <strong>04</strong>
                  <span>Quality Check</span>
                </div>

                <div>
                  <strong>05</strong>
                  <span>Delivered</span>
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              INFORMATION GRID
          ================================================= */}

          <div className="job-details-grid">


            {/* CUSTOMER */}

            <div className="job-details-section">

              <div className="job-details-section-title">
                CUSTOMER INFORMATION
              </div>


              <div className="details-info-list">

                <div className="details-info-row">

                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {job.customer}
                  </strong>

                </div>


                <div className="details-info-row">

                  <span>
                    PHONE
                  </span>

                  <strong>
                    {job.phone || "Not provided"}
                  </strong>

                </div>

              </div>

            </div>


            {/* VEHICLE */}

            <div className="job-details-section">

              <div className="job-details-section-title">
                VEHICLE INFORMATION
              </div>


              <div className="details-info-list">

                <div className="details-info-row">

                  <span>
                    VEHICLE
                  </span>

                  <strong>
                    {job.vehicle}
                  </strong>

                </div>


                <div className="details-info-row">

                  <span>
                    JOB TYPE
                  </span>

                  <strong>
                    {job.service}
                  </strong>

                </div>

              </div>

            </div>


            {/* MECHANIC */}

            <div className="job-details-section">

              <div className="job-details-section-title">
                ASSIGNED MECHANIC
              </div>


              <div className="details-mechanic">

                <div className="details-mechanic-icon">
                  🔧
                </div>

                <div>

                  <strong>
                    {job.mechanic}
                  </strong>

                  <span>
                    Technician
                  </span>

                </div>

              </div>

            </div>


            {/* SERVICE */}

            <div className="job-details-section">

              <div className="job-details-section-title">
                SERVICE DETAILS
              </div>


              <div className="details-info-list">

                <div className="details-info-row">

                  <span>
                    SERVICE
                  </span>

                  <strong>
                    {job.service}
                  </strong>

                </div>


                <div className="details-info-row">

                  <span>
                    AMOUNT
                  </span>

                  <strong className="details-green">
                    {job.amount}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="job-details-section">

            <div className="job-details-section-title">
              JOB DESCRIPTION
            </div>


            <div className="details-description">

              {job.description ||
                "No additional description has been added to this job card."}

            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="job-details-actions">

            <Link
              to="/job-cards"
              className="details-secondary-button"
            >
              ← BACK
            </Link>


            <button
              className="details-primary-button"
              onClick={() => {
                alert("Job status update feature will be connected next.");
              }}
            >
              UPDATE JOB STATUS →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobCardDetailsPage;