import React from "react";
import "./QADashboard.css";

const QADashboard = () => {
  const jobs = [
    { id: "JC–2488", customer: "Arjun Mehta", vehicle: "MH–12–AB–4521 (Swift)", mechanic: "Ravi Kumar", status: "In Repair", eta: "Today 5:00 PM", amount: "₹18,500" },
    { id: "JC–2487", customer: "Priya Sharma", vehicle: "DL–01–CZ–9834 (Creta)", mechanic: "Amit Patel", status: "Quality Check", eta: "Today 3:30 PM", amount: "₹8,200" },
    { id: "JC–2486", customer: "Rohit Desai", vehicle: "GJ–05–XY–7712 (Innova)", mechanic: "Suresh Nair", status: "Delivered", eta: "Delivered", amount: "₹12,400" },
    { id: "JC–2485", customer: "Neha Joshi", vehicle: "MH–14–PQ–3356 (City)", mechanic: "Ravi Kumar", status: "Inspection", eta: "Today 6:00 PM", amount: "₹4,800" },
    { id: "JC–2484", customer: "Vikram Singh", vehicle: "UP–32–GH–1190 (Fortuner)", mechanic: "Amit Patel", status: "Received", eta: "Tomorrow 12:00 PM", amount: "₹32,000" },
    { id: "JC–2483", customer: "Kavita Rao", vehicle: "KA–03–MN–5567 (Baleno)", mechanic: "Deepak Verma", status: "Delivered", eta: "Delivered", amount: "₹23,200" },
  ];

  const workload = [
    { mechanic: "Ravi Kumar", active: 3 },
    { mechanic: "Amit Patel", active: 2 },
    { mechanic: "Suresh Nair", active: 0 },
    { mechanic: "Deepak Verma", active: 1 },
    { mechanic: "Kiran Joshi", active: 0 },
  ];

  const alerts = [
    "Battery Problem Detected — 85% confidence",
    "Tyre Replacement Due — 78% confidence",
    "Low Stock: Oil Filter — 92% confidence",
  ];

  return (
    <div className="qa-dashboard">
      <h1>SmartGarage / Dashboard</h1>
      <p>— TODAY, 17 AUGUST 2026</p>
      <h2>OPERATIONS OVERVIEW</h2>

      <div className="metrics">
        <div>Today’s Jobs: 14 (8 active • 6 delivered)</div>
        <div>Revenue Today: ₹42,500 (+12% vs yesterday)</div>
        <div>Pending Invoices: 6 (₹48,294 outstanding)</div>
        <div>Low Stock Alerts: 3 (ACF, OIF, TYR)</div>
      </div>

      <h2>Active Job Cards</h2>
      <table>
        <thead>
          <tr>
            <th>Job ID</th><th>Customer</th><th>Vehicle</th><th>Mechanic</th><th>Status</th><th>ETA</th><th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.customer}</td>
              <td>{job.vehicle}</td>
              <td>{job.mechanic}</td>
              <td>{job.status}</td>
              <td>{job.eta}</td>
              <td>{job.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Mechanic Workload</h2>
      <ul>
        {workload.map(w => (
          <li key={w.mechanic}>{w.mechanic} — {w.active} active</li>
        ))}
      </ul>

      <h2>AI Alerts</h2>
      <ul>
        {alerts.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </div>
  );
};

export default QADashboard;
