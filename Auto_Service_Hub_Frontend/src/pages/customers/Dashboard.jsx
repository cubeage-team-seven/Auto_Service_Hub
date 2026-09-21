import React from "react";
import { Link } from "react-router-dom";
import "./DashboardLayout.css";

function Dashboard() {
  const activeJobs = [
    { id: "JC-2408", customer: "Arjun Mehta", vehicle: "MH-12-AB-4521 | Swift", mechanic: "Ravi Kumar", status: "In Repair", statusClass: "status-green", eta: "Today 5:00 PM", amount: "₹18,500" },
    { id: "JC-2407", customer: "Priya Sharma", vehicle: "DL-01-CZ-9834 | Creta", mechanic: "Amit Patel", status: "Quality Check", statusClass: "status-purple", eta: "Today 3:30 PM", amount: "₹8,200" },
    { id: "JC-2406", customer: "Rohit Desai", vehicle: "GJ-05-XY-7712 | Innova", mechanic: "Suresh Nair", status: "Delivered", statusClass: "status-darkgreen", eta: "Delivered", amount: "₹12,400" },
    { id: "JC-2405", customer: "Neha Joshi", vehicle: "MH-14-PQ-3356 | City", mechanic: "Ravi Kumar", status: "Inspection", statusClass: "status-brown", eta: "Today 6:00 PM", amount: "₹4,800" },
    { id: "JC-2404", customer: "Vikram Singh", vehicle: "UP-32-GH-1190 | Fortuner", mechanic: "Amit Patel", status: "Received", statusClass: "status-blue", eta: "Tomorrow 12:00 PM", amount: "₹32,000" },
    { id: "JC-2403", customer: "Kavita Rao", vehicle: "KA-03-MN-5567 | Baleno", mechanic: "Deepak Verma", status: "Delivered", statusClass: "status-darkgreen", eta: "Delivered", amount: "₹3,200" }
  ];

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">▰</span> SMARTGARAGE
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <span className="nav-icon">⊞</span> Dashboard
          </Link>
          <Link to="/appointments" className="nav-item">
            <span className="nav-icon">📋</span> Appointments
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="top-header">
          <div className="breadcrumb">SmartGarage / <span>Dashboard</span></div>
          <div className="header-right">
            <span className="role-badge">CUSTOMER</span>
            <span className="ai-badge">● 3 AI alerts</span>
            <div className="avatar">🚗</div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="dashboard-body">
          <div className="date-subtitle">— TODAY, 17 AUGUST 2026</div>
          <h1 className="page-title">OPERATIONS OVERVIEW</h1>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">TODAY'S JOBS</span>
              <div className="stat-value">14</div>
              <span className="stat-sub">8 active · 6 delivered</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">REVENUE TODAY</span>
              <div className="stat-value">₹42,500</div>
              <span className="stat-sub highlight-sub">+12% vs yesterday</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">PENDING INVOICES</span>
              <div className="stat-value">6</div>
              <span className="stat-sub">₹48,294 outstanding</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">LOW STOCK ALERTS</span>
              <div className="stat-value">3</div>
              <span className="stat-sub">ACF, OIF, TYR</span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="dashboard-main-grid">
            {/* LEFT TABLE AREA */}
            <div className="table-section">
              <h3 className="section-title">ACTIVE JOB CARDS</h3>
              <table className="custom-table">
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
                  {activeJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="job-id">{job.id}</td>
                      <td className="customer-name">{job.customer}</td>
                      <td className="text-muted">{job.vehicle}</td>
                      <td>{job.mechanic}</td>
                      <td>
                        <span className={`status-tag ${job.statusClass}`}>{job.status}</span>
                      </td>
                      <td className="text-muted">{job.eta}</td>
                      <td className="amount">{job.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RIGHT WIDGETS */}
            <div className="widgets-column">
              <div className="widget-card">
                <h4 className="widget-title">MECHANIC WORKLOAD</h4>
                <ul className="workload-list">
                  <li><span><span className="dot dot-yellow">●</span> Ravi Kumar</span> <span className="count">3 active</span></li>
                  <li><span><span className="dot dot-green">●</span> Amit Patel</span> <span className="count">2 active</span></li>
                  <li><span><span className="dot dot-gray">●</span> Suresh Nair</span> <span className="count">0 active</span></li>
                  <li><span><span className="dot dot-yellow">●</span> Deepak Verma</span> <span className="count">1 active</span></li>
                  <li><span><span className="dot dot-gray">●</span> Kiran Joshi</span> <span className="count">0 active</span></li>
                </ul>
              </div>

              <div className="widget-card">
                <h4 className="widget-title">AI ALERTS</h4>
                <div className="ai-alert-item">
                  <div className="alert-icon">🔍</div>
                  <div>
                    <div className="alert-title">Battery Problem Detected</div>
                    <div className="alert-sub">85% confidence</div>
                  </div>
                </div>
                <div className="ai-alert-item">
                  <div className="alert-icon">📅</div>
                  <div>
                    <div className="alert-title">Tyre Replacement Due</div>
                    <div className="alert-sub">78% confidence</div>
                  </div>
                </div>
                <div className="ai-alert-item">
                  <div className="alert-icon">📦</div>
                  <div>
                    <div className="alert-title">Low Stock: Oil Filter</div>
                    <div className="alert-sub">92% confidence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="lower-grid">
            <div className="widget-card flex-1">
              <h4 className="widget-title">REVENUE — THIS WEEK</h4>
              <div className="chart-placeholder">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            <div className="widget-card flex-1">
              <h4 className="widget-title">SERVICE DISTRIBUTION</h4>
              <div className="progress-list">
                <div className="progress-item">
                  <div className="p-label"><span>Full Service</span><span>34</span></div>
                  <div className="p-bar"><div className="p-fill" style={{ width: '80%', background: '#ccff00' }}></div></div>
                </div>
                <div className="progress-item">
                  <div className="p-label"><span>Engine & Mechanical</span><span>18</span></div>
                  <div className="p-bar"><div className="p-fill" style={{ width: '45%', background: '#3b82f6' }}></div></div>
                </div>
                <div className="progress-item">
                  <div className="p-label"><span>AC & Electrical</span><span>12</span></div>
                  <div className="p-bar"><div className="p-fill" style={{ width: '30%', background: '#a855f7' }}></div></div>
                </div>
                <div className="progress-item">
                  <div className="p-label"><span>Tyres & Brakes</span><span>28</span></div>
                  <div className="p-bar"><div className="p-fill" style={{ width: '65%', background: '#22c55e' }}></div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;