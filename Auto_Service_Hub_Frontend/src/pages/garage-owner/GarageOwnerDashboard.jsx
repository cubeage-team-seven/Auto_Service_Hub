import React from "react";
import "./GarageOwnerDashboard.css";

function GarageOwnerDashboard() {
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
      active: "3 active",
      activeClass: "busy",
    },
    {
      name: "Amit Patel",
      active: "2 active",
      activeClass: "busy",
    },
    {
      name: "Suresh Nair",
      active: "0 active",
      activeClass: "available",
    },
    {
      name: "Deepak Verma",
      active: "1 active",
      activeClass: "busy",
    },
    {
      name: "Kiran Joshi",
      active: "0 active",
      activeClass: "available",
    },
  ];

  return (
    <div className="garage-dashboard-page">

      {/* ================= PAGE HEADING ================= */}

      <section className="garage-dashboard-heading">
        <div className="garage-dashboard-date">
          — TODAY, 17 AUGUST 2026
        </div>

        <h1>OPERATIONS OVERVIEW</h1>
      </section>


      {/* ================= STAT CARDS ================= */}

      <section className="garage-dashboard-stats">

        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            TODAY'S JOBS
          </div>

          <div className="garage-dashboard-stat-value lime">
            14
          </div>

          <div className="garage-dashboard-stat-description">
            8 active · 6 delivered
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            REVENUE TODAY
          </div>

          <div className="garage-dashboard-stat-value">
            ₹42,500
          </div>

          <div className="garage-dashboard-stat-description">
            +12% vs yesterday
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            PENDING INVOICES
          </div>

          <div className="garage-dashboard-stat-value">
            6
          </div>

          <div className="garage-dashboard-stat-description">
            ₹48,294 outstanding
          </div>
        </div>


        <div className="garage-dashboard-stat-card">
          <div className="garage-dashboard-stat-label">
            LOW STOCK ALERTS
          </div>

          <div className="garage-dashboard-stat-value">
            3
          </div>

          <div className="garage-dashboard-stat-description">
            ACF, OIF, TYR
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

                {jobs.map((job) => (
                  <tr key={job.id}>

                    <td className="garage-dashboard-job-id">
                      {job.id.split("-")[0]}-
                      <br />
                      {job.id.split("-")[1]}
                    </td>

                    <td className="garage-dashboard-customer">
                      {job.customer}
                    </td>

                    <td className="garage-dashboard-vehicle">
                      {job.vehicle}
                    </td>

                    <td className="garage-dashboard-mechanic">
                      {job.mechanic}
                    </td>

                    <td>
                      <span
                        className={`garage-dashboard-status ${job.statusClass}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="garage-dashboard-eta">
                      {job.eta}
                    </td>

                    <td className="garage-dashboard-amount">
                      {job.amount}
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
                <div
                  className="garage-dashboard-mechanic-row"
                  key={mechanic.name}
                >

                  <div className="garage-dashboard-mechanic-person">

                    <span
                      className={`garage-dashboard-mechanic-dot ${mechanic.activeClass}`}
                    ></span>

                    <span>
                      {mechanic.name}
                    </span>

                  </div>

                  <span className="garage-dashboard-active-count">
                    {mechanic.active}
                  </span>

                </div>
              ))}

            </div>

          </div>


          {/* ================= AI ALERTS ================= */}

          <div className="garage-dashboard-panel garage-dashboard-ai">

            <div className="garage-dashboard-panel-title">
              AI ALERTS
            </div>

            <div className="garage-dashboard-alert-list">

              <div className="garage-dashboard-alert">

                <div className="garage-dashboard-alert-icon">
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


              <div className="garage-dashboard-alert">

                <div className="garage-dashboard-alert-icon">
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


              <div className="garage-dashboard-alert">

                <div className="garage-dashboard-alert-icon">
                  ◈
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


      {/* ================= BOTTOM SECTION ================= */}

      <section className="garage-dashboard-bottom">

        {/* ================= REVENUE ================= */}

        <div className="garage-dashboard-panel garage-dashboard-revenue">

          <div className="garage-dashboard-panel-title">
            REVENUE — THIS WEEK
          </div>

          <div className="garage-dashboard-chart">

            <div className="garage-dashboard-chart-area">
              <div className="garage-dashboard-chart-line"></div>
            </div>

            <div className="garage-dashboard-chart-days">
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


        {/* ================= SERVICE DISTRIBUTION ================= */}

        <div className="garage-dashboard-panel garage-dashboard-service">

          <div className="garage-dashboard-panel-title">
            SERVICE DISTRIBUTION
          </div>

          <div className="garage-dashboard-service-list">

            <div className="garage-dashboard-service-row">

              <div className="garage-dashboard-service-info">
                <strong>Full Service</strong>
                <span>34</span>
              </div>

              <div className="garage-dashboard-service-bar">
                <div
                  className="garage-dashboard-service-fill full"
                  style={{ width: "88%" }}
                ></div>
              </div>

            </div>


            <div className="garage-dashboard-service-row">

              <div className="garage-dashboard-service-info">
                <strong>Engine & Mechanical</strong>
                <span>18</span>
              </div>

              <div className="garage-dashboard-service-bar">
                <div
                  className="garage-dashboard-service-fill mechanical"
                  style={{ width: "57%" }}
                ></div>
              </div>

            </div>


            <div className="garage-dashboard-service-row">

              <div className="garage-dashboard-service-info">
                <strong>AC & Electrical</strong>
                <span>12</span>
              </div>

              <div className="garage-dashboard-service-bar">
                <div
                  className="garage-dashboard-service-fill electrical"
                  style={{ width: "38%" }}
                ></div>
              </div>

            </div>


            <div className="garage-dashboard-service-row">

              <div className="garage-dashboard-service-info">
                <strong>Tyres & Brakes</strong>
                <span>28</span>
              </div>

              <div className="garage-dashboard-service-bar">
                <div
                  className="garage-dashboard-service-fill tyres"
                  style={{ width: "72%" }}
                ></div>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default GarageOwnerDashboard;