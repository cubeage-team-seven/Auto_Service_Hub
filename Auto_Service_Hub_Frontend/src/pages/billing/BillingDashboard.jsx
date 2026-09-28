import React from "react";
import "./BillingPage.css";

function BillingDashboard() {
  return (
    <div>
      <div style={{ fontSize: "9px", color: "#d8ff3d", fontWeight: 800, letterSpacing: "1px", marginBottom: "4px" }}>
        — TODAY, 17 AUGUST 2026
      </div>
      <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 20px" }}>OPERATIONS OVERVIEW</h1>

      <div className="kpi-row">
        <div className="kpi-box">
          <span className="kpi-lbl">TODAY'S JOBS</span>
          <div className="kpi-val lime-text">14</div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>8 active · 6 delivered</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-lbl">REVENUE TODAY</span>
          <div className="kpi-val">₹42,500</div>
          <span style={{ fontSize: "10px", color: "#21d96b" }}>+12% vs yesterday</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-lbl">PENDING INVOICES</span>
          <div className="kpi-val">6</div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>₹48,294 outstanding</span>
        </div>
        <div className="kpi-box">
          <span className="kpi-lbl">LOW STOCK ALERTS</span>
          <div className="kpi-val">3</div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>ACF, OIF, TYR</span>
        </div>
      </div>

      <div className="grid-main">
        <div className="panel-box">
          <h3 style={{ fontSize: "11px", fontWeight: 800, margin: "0 0 15px", letterSpacing: "1px" }}>ACTIVE JOB CARDS</h3>
          <table className="crm-tbl">
            <thead>
              <tr>
                <th>JOB ID</th>
                <th>CUSTOMER</th>
                <th>VEHICLE</th>
                <th>MECHANIC</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="lime-text">JC-2408</td>
                <td style={{ fontWeight: 700 }}>Arjun Mehta</td>
                <td style={{ color: "rgba(255,255,255,0.4)" }}>Swift</td>
                <td>Ravi Kumar</td>
                <td style={{ fontWeight: 700 }}>₹18,500</td>
              </tr>
              <tr>
                <td className="lime-text">JC-2407</td>
                <td style={{ fontWeight: 700 }}>Priya Sharma</td>
                <td style={{ color: "rgba(255,255,255,0.4)" }}>Creta</td>
                <td>Amit Patel</td>
                <td style={{ fontWeight: 700 }}>₹8,200</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel-box">
          <h4 style={{ fontSize: "11px", fontWeight: 800, margin: "0 0 15px", letterSpacing: "1px" }}>AI ALERTS</h4>
          <div style={{ fontSize: "11px", marginBottom: "10px" }}>
            <strong>🔍 Battery Problem Detected</strong>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>85% confidence</div>
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>📦 Low Stock: Oil Filter</strong>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>92% confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingDashboard;