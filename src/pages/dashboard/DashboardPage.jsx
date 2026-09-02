import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardPage.css";

function DashboardPage() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (

    <div
      className={`dashboard-page ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* LOGO */}

        <div className="dashboard-logo">

          <div className="dashboard-logo-icon">
            ▰
          </div>

          <span>
           Auto_Service_Hub
          </span>

        </div>


        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <a
            href="#dashboard"
            className="dashboard-nav-item active"
          >

            <span className="dashboard-nav-icon">
              ▦
            </span>

            <span>
              Dashboard
            </span>

          </a>


          <Link
            to="/job-cards"
            className="dashboard-nav-item"
          >

            <span className="dashboard-nav-icon">
              ♧
            </span>

            <span>
              Job Cards
            </span>

          </Link>

        </nav>

      </aside>


      {/* =====================================================
          SIDEBAR TOGGLE
          OUTSIDE SIDEBAR SO IT NEVER DISAPPEARS
      ===================================================== */}

      <button
        type="button"
        className={`dashboard-sidebar-toggle ${
          sidebarOpen
            ? "dashboard-toggle-open"
            : "dashboard-toggle-closed"
        }`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "‹" : "›"}
      </button>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="dashboard-topbar">

          <div className="dashboard-breadcrumb">

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


          <div className="dashboard-top-actions">

            <div className="dashboard-role-badge">
              MECHANIC
            </div>


            <div className="dashboard-ai-alert">

              <span className="dashboard-status-dot"></span>

              3 AI alerts

            </div>


            <Link
                to="/"
                className="dashboard-user-button"
                title="Go to Main Page"
            >
                ⌂
            </Link>

          </div>

        </header>


        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <div className="dashboard-content">

          {/* PAGE TITLE */}

          <div className="dashboard-page-heading">

            <div className="dashboard-date">
              — TODAY, 17 AUGUST 2026
            </div>

            <h1>
              OPERATIONS OVERVIEW
            </h1>

          </div>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="dashboard-stat-grid">

            {/* TODAY'S JOBS */}

            <div className="dashboard-stat-card">

              <span className="dashboard-stat-label">
                TODAY'S JOBS
              </span>

              <strong className="dashboard-stat-value green">
                14
              </strong>

              <span className="dashboard-stat-description">
                8 active · 6 delivered
              </span>

            </div>


            {/* REVENUE */}

            <div className="dashboard-stat-card">

              <span className="dashboard-stat-label">
                REVENUE TODAY
              </span>

              <strong className="dashboard-stat-value">
                ₹42,500
              </strong>

              <span className="dashboard-stat-description">
                +12% vs yesterday
              </span>

            </div>


            {/* INVOICES */}

            <div className="dashboard-stat-card">

              <span className="dashboard-stat-label">
                PENDING INVOICES
              </span>

              <strong className="dashboard-stat-value">
                6
              </strong>

              <span className="dashboard-stat-description">
                ₹48,294 outstanding
              </span>

            </div>


            {/* LOW STOCK */}

            <div className="dashboard-stat-card">

              <span className="dashboard-stat-label">
                LOW STOCK ALERTS
              </span>

              <strong className="dashboard-stat-value">
                3
              </strong>

              <span className="dashboard-stat-description">
                ACE, OIE, TYR
              </span>

            </div>

          </section>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section className="dashboard-main-grid">


            {/* =================================================
                ACTIVE JOB CARDS
            ================================================= */}

            <div className="dashboard-panel dashboard-jobs-panel">

              <div className="dashboard-panel-header">
                ACTIVE JOB CARDS
              </div>


              <div className="dashboard-table-wrapper">

                <table className="dashboard-jobs-table">

                  <thead>

                    <tr>

                      <th>
                        JOB ID
                      </th>

                      <th>
                        CUSTOMER
                      </th>

                      <th>
                        VEHICLE
                      </th>

                      <th>
                        MECHANIC
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        ETA
                      </th>

                      <th>
                        AMOUNT
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td className="job-id">
                        JC-2408
                      </td>

                      <td className="customer-name">
                        Arjun Mehta
                      </td>

                      <td>
                        MH-12-AB-4521 | Swift
                      </td>

                      <td className="mechanic-name">
                        Ravi Kumar
                      </td>

                      <td>

                        <span className="status status-repair">
                          In Repair
                        </span>

                      </td>

                      <td>
                        Today 5:00 PM
                      </td>

                      <td className="amount">
                        ₹18,500
                      </td>

                    </tr>


                    <tr>

                      <td className="job-id">
                        JC-2407
                      </td>

                      <td className="customer-name">
                        Priya Sharma
                      </td>

                      <td>
                        DL-01-CZ-9834 | Creta
                      </td>

                      <td className="mechanic-name">
                        Amit Patel
                      </td>

                      <td>

                        <span className="status status-quality">
                          Quality Check
                        </span>

                      </td>

                      <td>
                        Today 3:30 PM
                      </td>

                      <td className="amount">
                        ₹8,200
                      </td>

                    </tr>


                    <tr>

                      <td className="job-id">
                        JC-2406
                      </td>

                      <td className="customer-name">
                        Rohit Desai
                      </td>

                      <td>
                        GJ-05-XY-7712 | Innova
                      </td>

                      <td className="mechanic-name">
                        Suresh Nair
                      </td>

                      <td>

                        <span className="status status-delivered">
                          Delivered
                        </span>

                      </td>

                      <td>
                        Delivered
                      </td>

                      <td className="amount">
                        ₹12,400
                      </td>

                    </tr>


                    <tr>

                      <td className="job-id">
                        JC-2405
                      </td>

                      <td className="customer-name">
                        Neha Joshi
                      </td>

                      <td>
                        MH-14-PQ-3356 | City
                      </td>

                      <td className="mechanic-name">
                        Ravi Kumar
                      </td>

                      <td>

                        <span className="status status-inspection">
                          Inspection
                        </span>

                      </td>

                      <td>
                        Today 6:00 PM
                      </td>

                      <td className="amount">
                        ₹4,800
                      </td>

                    </tr>


                    <tr>

                      <td className="job-id">
                        JC-2404
                      </td>

                      <td className="customer-name">
                        Vikram Singh
                      </td>

                      <td>
                        UP-32-GH-1190 | Fortuner
                      </td>

                      <td className="mechanic-name">
                        Amit Patel
                      </td>

                      <td>

                        <span className="status status-received">
                          Received
                        </span>

                      </td>

                      <td>
                        Tomorrow 12:00 PM
                      </td>

                      <td className="amount">
                        ₹32,000
                      </td>

                    </tr>


                    <tr>

                      <td className="job-id">
                        JC-2403
                      </td>

                      <td className="customer-name">
                        Kavita Rao
                      </td>

                      <td>
                        KA-03-MN-5567 | Baleno
                      </td>

                      <td className="mechanic-name">
                        Deepak Verma
                      </td>

                      <td>

                        <span className="status status-delivered">
                          Delivered
                        </span>

                      </td>

                      <td>
                        Delivered
                      </td>

                      <td className="amount">
                        ₹3,200
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="dashboard-right-column">


              {/* MECHANIC WORKLOAD */}

              <div className="dashboard-panel workload-panel">

                <div className="dashboard-panel-header">
                  MECHANIC WORKLOAD
                </div>


                <div className="workload-list">

                  <div className="workload-item">

                    <span className="workload-dot yellow"></span>

                    <strong>
                      Ravi Kumar
                    </strong>

                    <span>
                      3 active
                    </span>

                  </div>


                  <div className="workload-item">

                    <span className="workload-dot yellow"></span>

                    <strong>
                      Amit Patel
                    </strong>

                    <span>
                      2 active
                    </span>

                  </div>


                  <div className="workload-item">

                    <span className="workload-dot green"></span>

                    <strong>
                      Suresh Nair
                    </strong>

                    <span>
                      0 active
                    </span>

                  </div>


                  <div className="workload-item">

                    <span className="workload-dot yellow"></span>

                    <strong>
                      Deepak Verma
                    </strong>

                    <span>
                      1 active
                    </span>

                  </div>


                  <div className="workload-item">

                    <span className="workload-dot green"></span>

                    <strong>
                      Kiran Joshi
                    </strong>

                    <span>
                      0 active
                    </span>

                  </div>

                </div>

              </div>


              {/* AI ALERTS */}

              <div className="dashboard-panel alerts-panel">

                <div className="dashboard-panel-header">
                  AI ALERTS
                </div>


                <div className="alert-list">

                  <div className="alert-item">

                    <div className="alert-icon">
                      🔍
                    </div>

                    <div>

                      <strong>
                        Battery Problem Detected
                      </strong>

                      <span>
                        85% confidence
                      </span>

                    </div>

                  </div>


                  <div className="alert-item">

                    <div className="alert-icon">
                      ▦
                    </div>

                    <div>

                      <strong>
                        Tyre Replacement Due
                      </strong>

                      <span>
                        78% confidence
                      </span>

                    </div>

                  </div>


                  <div className="alert-item">

                    <div className="alert-icon">
                      📦
                    </div>

                    <div>

                      <strong>
                        Low Stock: Oil Filter
                      </strong>

                      <span>
                        92% confidence
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              BOTTOM GRID
          ================================================= */}

          <section className="dashboard-bottom-grid">


            {/* REVENUE CHART */}

            <div className="dashboard-panel revenue-panel">

              <div className="dashboard-panel-header">
                REVENUE — THIS WEEK
              </div>


              <div className="revenue-chart">

                <div className="chart-line"></div>

                <div className="chart-days">

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


            {/* SERVICE DISTRIBUTION */}

            <div className="dashboard-panel service-panel">

              <div className="dashboard-panel-header">
                SERVICE DISTRIBUTION
              </div>


              <div className="service-list">


                <div className="service-item">

                  <div className="service-item-top">

                    <strong>
                      Full Service
                    </strong>

                    <span>
                      34
                    </span>

                  </div>

                  <div className="service-bar">

                    <div
                      className="service-fill full"
                      style={{ width: "82%" }}
                    ></div>

                  </div>

                </div>


                <div className="service-item">

                  <div className="service-item-top">

                    <strong>
                      Engine & Mechanical
                    </strong>

                    <span>
                      18
                    </span>

                  </div>

                  <div className="service-bar">

                    <div
                      className="service-fill engine"
                      style={{ width: "55%" }}
                    ></div>

                  </div>

                </div>


                <div className="service-item">

                  <div className="service-item-top">

                    <strong>
                      AC & Electrical
                    </strong>

                    <span>
                      12
                    </span>

                  </div>

                  <div className="service-bar">

                    <div
                      className="service-fill electrical"
                      style={{ width: "35%" }}
                    ></div>

                  </div>

                </div>


                <div className="service-item">

                  <div className="service-item-top">

                    <strong>
                      Tyres & Brakes
                    </strong>

                    <span>
                      28
                    </span>

                  </div>

                  <div className="service-bar">

                    <div
                      className="service-fill tyres"
                      style={{ width: "68%" }}
                    ></div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default DashboardPage;