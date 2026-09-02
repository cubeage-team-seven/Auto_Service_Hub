import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./InventoryDashboard.css";

function InventoryDashboard() {
  const navigate = useNavigate();

  // Figma Inventory Dashboard uses collapsed sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const jobs = [
    {
      id: "JC-2408",
      customer: "Arjun Mehta",
      vehicle: "MH-12-AB-4521 | Swift",
      mechanic: "Ravi Kumar",
      status: "In Repair",
      statusClass: "repair",
      eta: "Today 5:00 PM",
      amount: "₹18,500",
    },
    {
      id: "JC-2407",
      customer: "Priya Sharma",
      vehicle: "DL-01-CZ-9834 | Creta",
      mechanic: "Amit Patel",
      status: "Quality Check",
      statusClass: "quality",
      eta: "Today 3:30 PM",
      amount: "₹8,200",
    },
    {
      id: "JC-2406",
      customer: "Rohit Desai",
      vehicle: "GJ-05-XY-7712 | Innova",
      mechanic: "Suresh Nair",
      status: "Delivered",
      statusClass: "delivered",
      eta: "Delivered",
      amount: "₹12,400",
    },
    {
      id: "JC-2405",
      customer: "Neha Joshi",
      vehicle: "MH-14-PQ-3356 | City",
      mechanic: "Ravi Kumar",
      status: "Inspection",
      statusClass: "inspection",
      eta: "Today 6:00 PM",
      amount: "₹4,800",
    },
    {
      id: "JC-2404",
      customer: "Vikram Singh",
      vehicle: "UP-32-GH-1190 | Fortuner",
      mechanic: "Amit Patel",
      status: "Received",
      statusClass: "received",
      eta: "Tomorrow 12:00 PM",
      amount: "₹32,000",
    },
    {
      id: "JC-2403",
      customer: "Kavita Rao",
      vehicle: "KA-03-MN-5567 | Baleno",
      mechanic: "Deepak Verma",
      status: "Delivered",
      statusClass: "delivered",
      eta: "Delivered",
      amount: "₹3,200",
    },
  ];

  const mechanics = [
    {
      name: "Ravi Kumar",
      count: "3 active",
      active: true,
    },
    {
      name: "Amit Patel",
      count: "2 active",
      active: true,
    },
    {
      name: "Suresh Nair",
      count: "0 active",
      active: false,
    },
    {
      name: "Deepak Verma",
      count: "1 active",
      active: true,
    },
    {
      name: "Kiran Joshi",
      count: "0 active",
      active: false,
    },
  ];

  const alerts = [
    {
      icon: "🔍",
      title: "Battery Problem Detected",
      confidence: "85% confidence",
    },
    {
      icon: "▦",
      title: "Tyre Replacement Due",
      confidence: "78% confidence",
    },
    {
      icon: "📦",
      title: "Low Stock: Oil Filter",
      confidence: "92% confidence",
    },
  ];

  return (
    <div
      className={`inventory-dashboard-page ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="inventory-dashboard-sidebar">

        {/* LOGO */}

        <div className="inventory-dashboard-logo">

          <div className="inventory-dashboard-logo-icon">
            ▰
          </div>

          {sidebarOpen && (
            <span>
              Auto_Service_Hub
            </span>
          )}

        </div>


        {/* NAVIGATION */}

        <nav className="inventory-dashboard-nav">

          <Link
            to="/inventory-dashboard"
            className="inventory-dashboard-nav-item active"
          >
            <span className="inventory-dashboard-nav-icon">
              ▦
            </span>

            {sidebarOpen && (
              <span>
                Dashboard
              </span>
            )}
          </Link>


          <Link
            to="/inventory"
            className="inventory-dashboard-nav-item"
          >
            <span className="inventory-dashboard-nav-icon">
              ◈
            </span>

            {sidebarOpen && (
              <span>
                Inventory
              </span>
            )}
          </Link>

        </nav>


        {/* SIDEBAR TOGGLE */}

        <button
          type="button"
          className="inventory-dashboard-sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "‹" : "›"}
        </button>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="inventory-dashboard-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="inventory-dashboard-topbar">

          {/* BREADCRUMB */}

          <div className="inventory-dashboard-breadcrumb">

            <span>
              Auto_Service_Hub
            </span>

            <b>
              /
            </b>

            <strong>
              Dashboard
            </strong>

          </div>


          {/* TOP RIGHT */}

          <div className="inventory-dashboard-top-actions">

            <span className="inventory-dashboard-role-badge">
              INVENTORY MANAGER
            </span>


            <div className="inventory-dashboard-ai-alert">

              <span className="inventory-dashboard-status-dot"></span>

              3 AI alerts

            </div>


           <button
              type="button"
              className="inventory-dashboard-round-button"
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

        <section className="inventory-dashboard-content">

          {/* DATE */}

          <div className="inventory-dashboard-date">
            — TODAY, 17 AUGUST 2026
          </div>


          {/* TITLE */}

          <h1 className="inventory-dashboard-title">
            OPERATIONS OVERVIEW
          </h1>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="inventory-dashboard-stat-grid">

            <StatCard
              title="TODAY'S JOBS"
              value="14"
              subtitle="8 active · 6 delivered"
              green
            />

            <StatCard
              title="REVENUE TODAY"
              value="₹42,500"
              subtitle="+12% vs yesterday"
            />

            <StatCard
              title="PENDING INVOICES"
              value="6"
              subtitle="₹48,294 outstanding"
            />

            <StatCard
              title="LOW STOCK ALERTS"
              value="3"
              subtitle="ACE, OIE, TYR"
            />

          </div>


          {/* =================================================
              DASHBOARD GRID
          ================================================= */}

          <div className="inventory-dashboard-main-grid">

            {/* =================================================
                ACTIVE JOB CARDS
            ================================================= */}

            <div className="inventory-dashboard-panel inventory-dashboard-jobs-panel">

              <div className="inventory-dashboard-panel-header">
                ACTIVE JOB CARDS
              </div>


              {/* TABLE HEADER */}

              <div className="inventory-dashboard-job-header">

                <span>
                  JOB ID
                </span>

                <span>
                  CUSTOMER
                </span>

                <span>
                  VEHICLE
                </span>

                <span>
                  MECHANIC
                </span>

                <span>
                  STATUS
                </span>

                <span>
                  ETA
                </span>

                <span>
                  AMOUNT
                </span>

              </div>


              {/* JOB ROWS */}

              <div className="inventory-dashboard-jobs">

                {jobs.map((job) => (

                  <div
                    className="inventory-dashboard-job-row"
                    key={job.id}
                  >

                    <span className="job-id">
                      {job.id}
                    </span>


                    <strong className="job-customer">
                      {job.customer}
                    </strong>


                    <span className="job-vehicle">
                      {job.vehicle}
                    </span>


                    <strong className="job-mechanic">
                      {job.mechanic}
                    </strong>


                    <span className={`job-status ${job.statusClass}`}>
                      {job.status}
                    </span>


                    <span className="job-eta">
                      {job.eta}
                    </span>


                    <strong className="job-amount">
                      {job.amount}
                    </strong>

                  </div>

                ))}

              </div>

            </div>


            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="inventory-dashboard-right-column">

              {/* =================================================
                  MECHANIC WORKLOAD
              ================================================= */}

              <div className="inventory-dashboard-panel">

                <div className="inventory-dashboard-panel-header">
                  MECHANIC WORKLOAD
                </div>


                <div className="inventory-dashboard-workload">

                  {mechanics.map((mechanic) => (

                    <div
                      className="inventory-dashboard-workload-row"
                      key={mechanic.name}
                    >

                      <span className="workload-name">

                        <span
                          className={`workload-dot ${
                            mechanic.active ? "active" : "inactive"
                          }`}
                        >
                          ●
                        </span>

                        {mechanic.name}

                      </span>


                      <span className="workload-count">
                        {mechanic.count}
                      </span>

                    </div>

                  ))}

                </div>

              </div>


              {/* =================================================
                  AI ALERTS
              ================================================= */}

              <div className="inventory-dashboard-panel">

                <div className="inventory-dashboard-panel-header">
                  AI ALERTS
                </div>


                <div className="inventory-dashboard-alert-list">

                  {alerts.map((alert) => (

                    <Alert
                      key={alert.title}
                      icon={alert.icon}
                      title={alert.title}
                      confidence={alert.confidence}
                    />

                  ))}

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="inventory-dashboard-bottom-grid">

            {/* =================================================
                REVENUE THIS WEEK
            ================================================= */}

            <div className="inventory-dashboard-panel revenue-panel">

              <div className="inventory-dashboard-panel-header">
                REVENUE — THIS WEEK
              </div>


              <div className="revenue-chart">

                <div className="revenue-chart-line"></div>

                <div className="revenue-days">

                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>

                </div>

              </div>

            </div>


            {/* =================================================
                SERVICE DISTRIBUTION
            ================================================= */}

            <div className="inventory-dashboard-panel service-panel">

              <div className="inventory-dashboard-panel-header">
                SERVICE DISTRIBUTION
              </div>


              <div className="service-distribution">

                <ServiceBar
                  title="Full Service"
                  value="34"
                  width="92%"
                  type="full"
                />

                <ServiceBar
                  title="Engine & Mechanical"
                  value="18"
                  width="52%"
                  type="engine"
                />

                <ServiceBar
                  title="AC & Electrical"
                  value="12"
                  width="38%"
                  type="ac"
                />

                <ServiceBar
                  title="Tyres & Brakes"
                  value="28"
                  width="75%"
                  type="tyres"
                />

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  green = false,
}) {
  return (
    <div className="inventory-dashboard-stat-card">

      <div className="stat-label">
        {title}
      </div>

      <div
        className={`stat-value ${
          green ? "green" : ""
        }`}
      >
        {value}
      </div>

      <div className="stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
}


/* =========================================================
   AI ALERT
========================================================= */

function Alert({
  icon,
  title,
  confidence,
}) {
  return (
    <div className="inventory-dashboard-alert">

      <div className="alert-icon">
        {icon}
      </div>

      <div className="alert-content">

        <div className="alert-title">
          {title}
        </div>

        <div className="alert-confidence">
          {confidence}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SERVICE BAR
========================================================= */

function ServiceBar({
  title,
  value,
  width,
  type,
}) {
  return (
    <div className="service-item">

      <div className="service-item-top">

        <strong>
          {title}
        </strong>

        <span>
          {value}
        </span>

      </div>

      <div className="service-track">

        <div
          className={`service-fill ${type}`}
          style={{
            width: width,
          }}
        ></div>

      </div>

    </div>
  );
}


export default InventoryDashboard;