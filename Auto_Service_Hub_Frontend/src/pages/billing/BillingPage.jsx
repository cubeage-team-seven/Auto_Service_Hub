import React, { useState } from "react";
import BillingDashboard from "./BillingDashboard";
import "./BillingPage.css";

function BillingPage() {
  const [activeTab, setActiveTab] = useState("billing");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="billing-layout">
      <aside className="sidebar">
        <div className="brand-header">
          <div style={{ background: "#d8ff3d", color: "#000", padding: "2px 6px", borderRadius: "3px" }}>▰</div>
          <span>SMARTGARAGE</span>
        </div>

        <nav className="nav-list">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            ⊞ Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === "billing" ? "active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            ☆ Billing
          </button>
        </nav>
      </aside>

      <main className="main-view">
        <header className="top-bar">
          <div className="bread-text">SmartGarage / <span style={{ color: "#fff" }}>Billing</span></div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="badge-lime">BILLING</span>
            <span className="badge-dark">● 3 AI alerts</span>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          <BillingDashboard />
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0 }}>BILLING & PAYMENTS</h1>
              <button
                style={{ background: "#d8ff3d", color: "#000", border: "none", padding: "8px 14px", fontWeight: 900, borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                onClick={() => setShowModal(true)}
              >
                + NEW ESTIMATE
              </button>
            </div>

            <div className="kpi-row">
              <div className="kpi-box">
                <span className="kpi-lbl">THIS MONTH</span>
                <div className="kpi-val">₹4.8L</div>
              </div>
              <div className="kpi-box">
                <span className="kpi-lbl">PENDING</span>
                <div className="kpi-val lime-text">₹48,294</div>
              </div>
              <div className="kpi-box">
                <span className="kpi-lbl">OVERDUE</span>
                <div className="kpi-val">₹33,630</div>
              </div>
              <div className="kpi-box">
                <span className="kpi-lbl">AVG INVOICE</span>
                <div className="kpi-val">₹12,400</div>
              </div>
            </div>

            <div className="panel-box">
              <table className="crm-tbl">
                <thead>
                  <tr>
                    <th>INVOICE</th>
                    <th>CUSTOMER</th>
                    <th>VEHICLE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="lime-text">INV-0892</td>
                    <td style={{ fontWeight: 700 }}>Rohit Desai</td>
                    <td style={{ color: "rgba(255,255,255,0.4)" }}>Innova GJ-05</td>
                    <td style={{ fontWeight: 700 }}>₹14,632</td>
                    <td><span className="tag-badge tag-paid">Paid</span></td>
                  </tr>
                  <tr>
                    <td className="lime-text">INV-0890</td>
                    <td style={{ fontWeight: 700 }}>Neha Joshi</td>
                    <td style={{ color: "rgba(255,255,255,0.4)" }}>City MH-14</td>
                    <td style={{ fontWeight: 700 }}>₹5,664</td>
                    <td><span className="tag-badge tag-pending">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ margin: "0 0 15px", fontSize: "12px", fontWeight: 900 }}>NEW ESTIMATE / INVOICE</h3>
            <div className="input-field">
              <label>CUSTOMER</label>
              <select className="crm-select">
                <option>Select customer...</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={{ flex: 1, background: "#d8ff3d", color: "#000", border: "none", padding: "10px", fontWeight: 900, borderRadius: "4px", cursor: "pointer" }}>
                SAVE
              </button>
              <button style={{ background: "#151515", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 16px", borderRadius: "4px", cursor: "pointer" }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingPage;