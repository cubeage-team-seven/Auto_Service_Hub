import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardLayout.css";

function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const appointmentsList = [
    { id: "APT-0881", time: "17 Aug 2026\n09:00 AM", customer: "Vikram Singh", vehicle: "Fortuner UP-32-GH-1190", service: "Suspension & Tyres", type: "Walk-in", bay: "Bay 3", pickup: "—", advisor: "Ramesh K.", status: "Confirmed", statusClass: "status-darkgreen" },
    { id: "APT-0882", time: "17 Aug 2026\n10:30 AM", customer: "Anjali Tiwari", vehicle: "Verna MH-04-RT-6621", service: "Full Service", type: "Online", bay: "Bay 1", pickup: "✓", advisor: "Ramesh K.", status: "Confirmed", statusClass: "status-darkgreen" },
    { id: "APT-0883", time: "17 Aug 2026\n12:00 PM", customer: "Karan Malhotra", vehicle: "Nexon TN-09-HH-2210", service: "AC Service", type: "Online", bay: "Bay 2", pickup: "—", advisor: "Sunita P.", status: "In Progress", statusClass: "status-green" },
    { id: "APT-0884", time: "17 Aug 2026\n02:00 PM", customer: "Sonal Gupta", vehicle: "WagonR GJ-01-AB-5541", service: "Basic Service", type: "Walk-in", bay: "Bay 4", pickup: "—", advisor: "Ramesh K.", status: "Pending", statusClass: "status-orange" },
    { id: "APT-0885", time: "18 Aug 2026\n09:30 AM", customer: "Arjun Mehta", vehicle: "Swift MH-12-AB-4521", service: "Battery Replacement", type: "Online", bay: "Bay 1", pickup: "—", advisor: "Sunita P.", status: "Confirmed", statusClass: "status-darkgreen" },
    { id: "APT-0886", time: "18 Aug 2026\n11:00 AM", customer: "Priya Sharma", vehicle: "Creta DL-01-CZ-9834", service: "Tyre Rotation", type: "Online", bay: "Bay 2", pickup: "—", advisor: "Ramesh K.", status: "Confirmed", statusClass: "status-darkgreen" },
    { id: "APT-0887", time: "19 Aug 2026\n10:00 AM", customer: "Neha Joshi", vehicle: "City MH-14-PQ-3356", service: "Denting & Painting", type: "Pickup/Drop", bay: "Bay 3", pickup: "✓", advisor: "Sunita P.", status: "Pending", statusClass: "status-orange" },
  ];

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">▰</span> SMARTGARAGE
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <span className="nav-icon">⊞</span> Dashboard
          </Link>
          <Link to="/appointments" className="nav-item active">
            <span className="nav-icon">📋</span> Appointments
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-header">
          <div className="breadcrumb">SmartGarage / <span>Appointments</span></div>
          <div className="header-right">
            <span className="role-badge">CUSTOMER</span>
            <span className="ai-badge">● 3 AI alerts</span>
            <div className="avatar">🚗</div>
          </div>
        </header>

        <div className="dashboard-body">
          <div className="page-header-action">
            <h1 className="page-title">APPOINTMENTS</h1>
            <button className="new-btn" onClick={() => setIsModalOpen(true)}>
              + NEW APPOINTMENT
            </button>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">TODAY</span>
              <div className="stat-value">4</div>
              <span className="stat-sub">2 confirmed · 1 pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">TOMORROW</span>
              <div className="stat-value">2</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">THIS WEEK</span>
              <div className="stat-value">12</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">PICKUP/DROP</span>
              <div className="stat-value">3</div>
              <span className="stat-sub">requiring logistics</span>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="filter-bar">
            <button className="filter-btn active">ALL DAYS</button>
            <button className="filter-btn">17 AUG</button>
            <button className="filter-btn">18 AUG</button>
            <button className="filter-btn">19 AUG</button>
          </div>

          {/* TABLE */}
          <div className="table-section">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE & TIME</th>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>SERVICE</th>
                  <th>TYPE</th>
                  <th>BAY</th>
                  <th>PICKUP</th>
                  <th>ADVISOR</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointmentsList.map((apt) => (
                  <tr key={apt.id}>
                    <td className="job-id">{apt.id}</td>
                    <td className="white-text" style={{ whiteSpace: "pre-line" }}>{apt.time}</td>
                    <td className="customer-name">{apt.customer}</td>
                    <td className="text-muted">{apt.vehicle}</td>
                    <td className="white-text">{apt.service}</td>
                    <td className="text-muted">{apt.type}</td>
                    <td className="text-muted">{apt.bay}</td>
                    <td className="green-check">{apt.pickup}</td>
                    <td className="text-muted">{apt.advisor}</td>
                    <td>
                      <span className={`status-tag ${apt.statusClass}`}>{apt.status}</span>
                    </td>
                    <td>
                      <button className="edit-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* NEW APPOINTMENT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>NEW APPOINTMENT</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="modal-group">
                <label>APPOINTMENT TYPE</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="aptType" defaultChecked /> Walk-in
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="aptType" /> Online
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="aptType" /> Pickup/Drop
                  </label>
                </div>
              </div>

              <div className="modal-group">
                <label>CUSTOMER</label>
                <select defaultValue="">
                  <option value="" disabled>Select customer...</option>
                </select>
              </div>

              <div className="modal-group">
                <label>VEHICLE</label>
                <select defaultValue="">
                  <option value="" disabled>Select vehicle...</option>
                </select>
              </div>

              <div className="modal-group">
                <label>SERVICE REQUIRED</label>
                <select defaultValue="Basic Service">
                  <option value="Basic Service">Basic Service</option>
                  <option value="Full Service">Full Service</option>
                </select>
              </div>

              <div className="modal-row">
                <div className="modal-group flex-1">
                  <label>DATE</label>
                  <input type="date" className="date-input" />
                </div>
                <div className="modal-group flex-1">
                  <label>TIME SLOT</label>
                  <select defaultValue="09:00 AM">
                    <option value="09:00 AM">09:00 AM</option>
                  </select>
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-group flex-1">
                  <label>BAY / SLOT</label>
                  <select defaultValue="Bay 1">
                    <option value="Bay 1">Bay 1</option>
                  </select>
                </div>
                <div className="modal-group flex-1">
                  <label>ASSIGNED ADVISOR</label>
                  <select defaultValue="Ramesh K.">
                    <option value="Ramesh K.">Ramesh K.</option>
                  </select>
                </div>
              </div>

              <div className="modal-group checkbox-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Customer requires pickup/drop service</span>
                </label>
              </div>

              <div className="modal-group">
                <label>SPECIAL NOTES</label>
                <textarea rows="3" placeholder="Any specific instructions or complaints..."></textarea>
              </div>

              <div className="modal-footer">
                <button type="submit" className="submit-modal-btn">BOOK APPOINTMENT</button>
                <button type="button" className="cancel-modal-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;