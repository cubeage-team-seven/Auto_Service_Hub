import React from "react";
import "./InventoryDashboard.css";

function InventoryDashboard() {
  const jobCards = [
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
      jobs: "3 active",
      active: true,
    },
    {
      name: "Amit Patel",
      jobs: "2 active",
      active: true,
    },
    {
      name: "Suresh Nair",
      jobs: "0 active",
      active: false,
    },
    {
      name: "Deepak Verma",
      jobs: "1 active",
      active: true,
    },
    {
      name: "Kiran Joshi",
      jobs: "0 active",
      active: false,
    },
  ];

  const alerts = [
    {
      icon: "⌕",
      title: "Battery Problem Detected",
      confidence: "85% confidence",
      iconClass: "battery-alert",
    },
    {
      icon: "▦",
      title: "Tyre Replacement Due",
      confidence: "78% confidence",
      iconClass: "tyre-alert",
    },
    {
      icon: "◆",
      title: "Low Stock: Oil Filter",
      confidence: "92% confidence",
      iconClass: "stock-alert",
    },
  ];

  const services = [
    {
      name: "Full Service",
      value: 34,
      width: "100%",
      className: "service-green",
    },
    {
      name: "Engine & Mechanical",
      value: 18,
      width: "53%",
      className: "service-blue",
    },
    {
      name: "AC & Electrical",
      value: 12,
      width: "35%",
      className: "service-purple",
    },
    {
      name: "Tyres & Brakes",
      value: 28,
      width: "82%",
      className: "service-teal",
    },
  ];

  return (
    <div className="inventory-dashboard">

      {/* =====================================================
          DATE + TITLE
      ===================================================== */}

      <div className="inventory-dashboard-heading">

        <div className="inventory-dashboard-date">
          — TODAY, 17 AUGUST 2026
        </div>

        <h1>
          OPERATIONS OVERVIEW
        </h1>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="inventory-dashboard-stat-grid">

        <div className="inventory-dashboard-stat-card">

          <div className="inventory-dashboard-stat-title">
            TODAY'S JOBS
          </div>

          <div className="inventory-dashboard-stat-number lime">
            14
          </div>

          <div className="inventory-dashboard-stat-description">
            8 active • 6 delivered
          </div>

        </div>


        <div className="inventory-dashboard-stat-card">

          <div className="inventory-dashboard-stat-title">
            REVENUE TODAY
          </div>

          <div className="inventory-dashboard-stat-number">
            ₹42,500
          </div>

          <div className="inventory-dashboard-stat-description">
            +12% vs yesterday
          </div>

        </div>


        <div className="inventory-dashboard-stat-card">

          <div className="inventory-dashboard-stat-title">
            PENDING INVOICES
          </div>

          <div className="inventory-dashboard-stat-number">
            6
          </div>

          <div className="inventory-dashboard-stat-description">
            ₹48,294 outstanding
          </div>

        </div>


        <div className="inventory-dashboard-stat-card">

          <div className="inventory-dashboard-stat-title">
            LOW STOCK ALERTS
          </div>

          <div className="inventory-dashboard-stat-number">
            3
          </div>

          <div className="inventory-dashboard-stat-description">
            ACF, OIF, TYR
          </div>

        </div>

      </div>


      {/* =====================================================
          MIDDLE SECTION
      ===================================================== */}

      <div className="inventory-dashboard-middle">

        {/* ===================================================
            ACTIVE JOB CARDS
        =================================================== */}

        <section className="inventory-dashboard-panel jobs-panel">

          <div className="inventory-dashboard-panel-title">
            ACTIVE JOB CARDS
          </div>

          <div className="inventory-dashboard-table-wrapper">

            <table className="inventory-dashboard-table">

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

                {jobCards.map((job) => (
                  <tr key={job.id}>

                    <td className="job-id">
                      {job.id}
                    </td>

                    <td className="customer-name">
                      {job.customer}
                    </td>

                    <td className="vehicle-name">
                      {job.vehicle}
                    </td>

                    <td className="mechanic-name">
                      {job.mechanic}
                    </td>

                    <td>

                      <span
                        className={`job-status ${job.statusClass}`}
                      >
                        {job.status}
                      </span>

                    </td>

                    <td className="job-eta">
                      {job.eta}
                    </td>

                    <td className="job-amount">
                      {job.amount}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="inventory-dashboard-right">

          {/* =================================================
              MECHANIC WORKLOAD
          ================================================= */}

          <section className="inventory-dashboard-panel mechanic-panel">

            <div className="inventory-dashboard-panel-title">
              MECHANIC WORKLOAD
            </div>

            <div className="mechanic-list">

              {mechanics.map((mechanic) => (
                <div
                  className="mechanic-row"
                  key={mechanic.name}
                >

                  <div className="mechanic-left">

                    <span
                      className={`mechanic-dot ${
                        mechanic.active
                          ? "active"
                          : "inactive"
                      }`}
                    />

                    <span className="mechanic-name-text">
                      {mechanic.name}
                    </span>

                  </div>

                  <span className="mechanic-jobs">
                    {mechanic.jobs}
                  </span>

                </div>
              ))}

            </div>

          </section>


          {/* =================================================
              AI ALERTS
          ================================================= */}

          <section className="inventory-dashboard-panel ai-panel">

            <div className="inventory-dashboard-panel-title">
              AI ALERTS
            </div>

            <div className="ai-alert-list">

              {alerts.map((alert, index) => (
                <div
                  className="ai-alert-row"
                  key={index}
                >

                  <div className={`ai-alert-icon ${alert.iconClass}`}>
                    {alert.icon}
                  </div>

                  <div className="ai-alert-content">

                    <div className="ai-alert-title">
                      {alert.title}
                    </div>

                    <div className="ai-alert-confidence">
                      {alert.confidence}
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>

        </div>

      </div>


      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="inventory-dashboard-bottom">

        {/* ===================================================
            REVENUE THIS WEEK
        =================================================== */}

        <section className="inventory-dashboard-panel revenue-panel">

          <div className="inventory-dashboard-panel-title">
            REVENUE — THIS WEEK
          </div>

          <div className="revenue-chart">

            <div className="revenue-chart-area">

              <div className="revenue-line line-one" />
              <div className="revenue-line line-two" />

            </div>

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

        </section>


        {/* ===================================================
            SERVICE DISTRIBUTION
        =================================================== */}

        <section className="inventory-dashboard-panel service-panel">

          <div className="inventory-dashboard-panel-title">
            SERVICE DISTRIBUTION
          </div>

          <div className="service-list">

            {services.map((service) => (
              <div
                className="service-row"
                key={service.name}
              >

                <div className="service-label-row">

                  <span className="service-name">
                    {service.name}
                  </span>

                  <span className="service-value">
                    {service.value}
                  </span>

                </div>

                <div className="service-track">

                  <span
                    className={`service-bar ${service.className}`}
                    style={{
                      width: service.width,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default InventoryDashboard;