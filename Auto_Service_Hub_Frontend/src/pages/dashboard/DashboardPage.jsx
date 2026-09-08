import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./DashboardPage.css";

function DashboardPage() {
  const sidebarStyle = {
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
  };

  const brandStyle = {
    height: "120px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "0 24px",
    borderBottom: "1px solid #252525",
  };

  const logoStyle = {
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
  };

  const brandNameStyle = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    letterSpacing: "0.5px",
  };

  const navStyle = {
    display: "flex",
    flexDirection: "column",
    paddingTop: "18px",
  };

  const navLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    height: "52px",
    padding: "0 22px",
    color: "#777777",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    borderLeft: "3px solid transparent",
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    color: "#baff00",
    background: "rgba(186, 255, 0, 0.07)",
    borderLeft: "3px solid #baff00",
  };

  return (
    <div className="dashboard-page sidebar-open">

      {/* =====================================================
          MECHANIC SIDEBAR
      ===================================================== */}

      <aside style={sidebarStyle}>

        {/* BRAND */}
        <div style={brandStyle}>

          <div style={logoStyle}>
            ▰
          </div>

          <div style={brandNameStyle}>
            SMARTGARAGE
          </div>

        </div>


        {/* MENU */}
        <nav style={navStyle}>

          <NavLink
            to="/mechanic-dashboard"
            end
            style={({ isActive }) =>
              isActive ? activeNavLinkStyle : navLinkStyle
            }
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
            style={({ isActive }) =>
              isActive ? activeNavLinkStyle : navLinkStyle
            }
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
          }}
        >
          ‹
        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="dashboard-main"
        style={{
          marginLeft: "260px",
        }}
      >

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="dashboard-topbar">

          <div className="dashboard-breadcrumb">

            <span>
              SmartGarage
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
              ↗
            </Link>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="dashboard-content">


          {/* =================================================
              DATE + HEADING
          ================================================= */}

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


            {/* PENDING INVOICES */}

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
                ACF, OIF, TYR
              </span>

            </div>

          </section>


          {/* =================================================
              ACTIVE JOB CARDS + RIGHT COLUMN
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


                    {/* JOB 2408 */}

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


                    {/* JOB 2407 */}

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


                    {/* JOB 2406 */}

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


                    {/* JOB 2405 */}

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


                    {/* JOB 2404 */}

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


                    {/* JOB 2403 */}

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


              {/* =================================================
                  MECHANIC WORKLOAD
              ================================================= */}

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


              {/* =================================================
                  AI ALERTS
              ================================================= */}

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
              BOTTOM
          ================================================= */}

          <section className="dashboard-bottom-grid">


            {/* =================================================
                REVENUE
            ================================================= */}

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


            {/* =================================================
                SERVICE DISTRIBUTION
            ================================================= */}

            <div className="dashboard-panel service-panel">

              <div className="dashboard-panel-header">
                SERVICE DISTRIBUTION
              </div>


              <div className="service-list">


                {/* FULL SERVICE */}

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


                {/* ENGINE */}

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


                {/* ELECTRICAL */}

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


                {/* TYRES */}

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