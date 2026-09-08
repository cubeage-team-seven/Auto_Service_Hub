import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./JobCardListPage.css";

function JobCardListPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const jobCards = [
    {
      id: "JC-2408",
      customer: "Arjun Mehta",
      vehicle: "MH-12-AB-4521 | Swift",
      service: "Engine Overhaul",
      mechanic: "Ravi Kumar",
      status: "In Repair",
      time: "Today 5:00 PM",
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
      time: "Today 3:30 PM",
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
      time: "Delivered",
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
      time: "Today 6:00 PM",
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
      time: "Tomorrow 12:00 PM",
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
      time: "Delivered",
      amount: "₹3,200",
      progress: 5,
    },
  ];

  const filters = [
    "ALL",
    "RECEIVED",
    "INSPECTION",
    "REPAIR",
    "QC",
    "DELIVERED",
  ];

  const getFilteredCards = () => {
    if (activeFilter === "ALL") {
      return jobCards;
    }

    return jobCards.filter((card) => {
      if (activeFilter === "RECEIVED") {
        return card.status === "Received";
      }

      if (activeFilter === "INSPECTION") {
        return card.status === "Inspection";
      }

      if (activeFilter === "REPAIR") {
        return card.status === "In Repair";
      }

      if (activeFilter === "QC") {
        return card.status === "Quality Check";
      }

      if (activeFilter === "DELIVERED") {
        return card.status === "Delivered";
      }

      return true;
    });
  };

  const filteredCards = getFilteredCards();

  const getStatusClass = (status) => {
    switch (status) {
      case "In Repair":
        return "job-status repair";

      case "Quality Check":
        return "job-status qc";

      case "Delivered":
        return "job-status delivered";

      case "Inspection":
        return "job-status inspection";

      case "Received":
        return "job-status received";

      default:
        return "job-status";
    }
  };

  return (
    <div className="jobcards-page">

      {/* =====================================================
          MECHANIC SIDEBAR
      ===================================================== */}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "260px",
          height: "100vh",
          background: "#0d0d0d",
          borderRight: "1px solid #252525",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* BRAND */}

        <div
          style={{
            height: "120px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "0 24px",
            borderBottom: "1px solid #252525",
          }}
        >

          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "5px",
              background: "#baff00",
              color: "#101010",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "900",
            }}
          >
            ▰
          </div>

          <div
            style={{
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "0.5px",
            }}
          >
            SMARTGARAGE
          </div>

        </div>


        {/* MENU */}

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "18px",
          }}
        >

          <NavLink
            to="/mechanic-dashboard"
            end
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "14px",
              height: "52px",
              padding: "0 22px",
              color: isActive ? "#baff00" : "#777777",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              background: isActive
                ? "rgba(186, 255, 0, 0.07)"
                : "transparent",
              borderLeft: isActive
                ? "3px solid #baff00"
                : "3px solid transparent",
            })}
          >
            <span style={{ fontSize: "18px" }}>
              ▦
            </span>

            <span>
              Dashboard
            </span>
          </NavLink>


          <NavLink
            to="/job-cards"
            end
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "14px",
              height: "52px",
              padding: "0 22px",
              color: isActive ? "#baff00" : "#777777",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              background: isActive
                ? "rgba(186, 255, 0, 0.07)"
                : "transparent",
              borderLeft: isActive
                ? "3px solid #baff00"
                : "3px solid transparent",
            })}
          >
            <span style={{ fontSize: "18px" }}>
              ▢
            </span>

            <span>
              Job Cards
            </span>
          </NavLink>

        </nav>


        {/* BOTTOM */}

        <div
          style={{
            marginTop: "auto",
            height: "55px",
            borderTop: "1px solid #252525",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777777",
            fontSize: "20px",
          }}
        >
          ‹
        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="jobcards-main"
        style={{
          marginLeft: "260px",
        }}
      >

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="jobcards-topbar">

          <div className="jobcards-breadcrumb">

            <span>
              SmartGarage
            </span>

            <b>
              /
            </b>

            <strong>
              Job Cards
            </strong>

          </div>


          <div className="jobcards-top-actions">

            <div className="jobcards-role">
              MECHANIC
            </div>

            <div className="jobcards-alert">

              <span></span>

              3 AI alerts

            </div>

            <button
              type="button"
              className="jobcards-settings"
              title="Settings"
            >
              ⚙
            </button>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="jobcards-content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="jobcards-page-header">

            <h1>
              JOB CARDS
            </h1>

            <Link
              to="/job-cards/create"
              className="new-jobcard-button"
            >
              + NEW JOB CARD
            </Link>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="jobcards-stats">

            <div className="jobcard-stat">

              <span>
                TOTAL TODAY
              </span>

              <strong>
                14
              </strong>

            </div>


            <div className="jobcard-stat">

              <span>
                IN REPAIR
              </span>

              <strong className="lime">
                4
              </strong>

            </div>


            <div className="jobcard-stat">

              <span>
                QC
              </span>

              <strong>
                2
              </strong>

            </div>


            <div className="jobcard-stat">

              <span>
                DELIVERED
              </span>

              <strong>
                6
              </strong>

            </div>


            <div className="jobcard-stat">

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

          <div className="jobcards-filters">

            {filters.map((filter) => (

              <button
                key={filter}
                type="button"
                className={
                  activeFilter === filter
                    ? "job-filter active"
                    : "job-filter"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>

            ))}

          </div>


          {/* =================================================
              JOB CARDS
          ================================================= */}

          <div className="jobcards-list">

            {filteredCards.map((card) => (

              <div
                className="job-card"
                key={card.id}
              >

                {/* TOP INFORMATION */}

                <div className="job-card-info">


                  {/* LEFT */}

                  <div className="job-card-left">

                    <div className="job-card-id">
                      {card.id}
                    </div>

                    <h2>
                      {card.customer}
                    </h2>

                    <p>
                      {card.vehicle}
                    </p>

                  </div>


                  {/* SERVICE */}

                  <div className="job-card-service">

                    <span>
                      SERVICE
                    </span>

                    <strong>
                      {card.service}
                    </strong>

                    <p>
                      Mechanic: {card.mechanic}
                    </p>

                  </div>


                  {/* STATUS */}

                  <div className="job-card-status-area">

                    <span
                      className={getStatusClass(card.status)}
                    >
                      {card.status}
                    </span>

                  </div>


                  {/* RIGHT */}

                  <div className="job-card-right">

                    <span className="job-card-time">
                      {card.time}
                    </span>

                    <strong className="job-card-amount">
                      {card.amount}
                    </strong>

                  </div>


                  {/* DETAILS */}

                  <Link
                    to={`/job-cards/${card.id}`}
                    className="job-card-details"
                  >
                    Details
                  </Link>

                </div>


                {/* PROGRESS */}

                <div className="job-progress">

                  <div className="job-progress-bars">

                    {[1, 2, 3, 4, 5].map((step) => (

                      <div
                        key={step}
                        className={
                          step <= card.progress
                            ? "job-progress-segment complete"
                            : "job-progress-segment"
                        }
                      ></div>

                    ))}

                  </div>


                  <div className="job-progress-labels">

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


            {filteredCards.length === 0 && (

              <div className="jobcards-empty">
                No job cards found for this status.
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobCardListPage;