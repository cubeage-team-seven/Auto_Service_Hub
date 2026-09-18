import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./ServiceAdvisor.css";

const nav = [
  ["▦", "Dashboard", "/service-advisor"],
  ["♙", "Customers", "/service-advisor/customers"],
  ["▱", "Vehicles", "/service-advisor/vehicles"],
  ["□", "Appointments", "/service-advisor/appointments"],
  ["◇", "Job Cards", "/service-advisor/jobcards"],
  ["♢", "Packages", "/service-advisor/packages"],
];

export default function ServiceAdvisorLayout() {
  const navigate = useNavigate();

  return (
    <div className="sa-shell">
      <aside className="sa-sidebar">
        <div className="sa-logo-row">
          <div className="sa-logo-icon">◆</div>
          <div className="sa-logo">SMARTGARAGE</div>
        </div>

        <nav className="sa-nav">
          {nav.map(([icon, label, to]) => (
            <NavLink
              key={label}
              to={to}
              end={label === "Dashboard"}
              className={({ isActive }) => `sa-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="sa-nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sa-sidebar-bottom">
          <button onClick={() => navigate("/modules")} className="sa-collapse">‹</button>
        </div>
      </aside>

      <main className="sa-main">
        <header className="sa-topbar">
          <div className="sa-breadcrumb">
            <span>SmartGarage</span><b>/</b><strong>Service Advisor</strong>
          </div>
          <div className="sa-top-actions">
            <span className="sa-role">SERVICE ADVISOR</span>
            <span className="sa-alert-count"><i /> 3 AI alerts</span>
            <button className="sa-avatar">▣</button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
