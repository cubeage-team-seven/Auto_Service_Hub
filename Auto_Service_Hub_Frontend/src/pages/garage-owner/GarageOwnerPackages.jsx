import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./PackagesPage.css";

function PackagesPage() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="garage-packages-page">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="garage-packages-sidebar">

        {/* LOGO */}
        <div className="garage-packages-logo">
          <div className="garage-packages-logo-icon">
            ▰
          </div>

          <div className="garage-packages-logo-text">
            SMARTGARAGE
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="garage-packages-nav">

          <Link
            to="/garage-owner/dashboard"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/dashboard") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">▦</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/garage-owner/customers"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/customers") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">♙</span>
            <span>Customers</span>
          </Link>

          <Link
            to="/garage-owner/vehicles"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/vehicles") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">▱</span>
            <span>Vehicles</span>
          </Link>

          <Link
            to="/garage-owner/appointments"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/appointments") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">□</span>
            <span>Appointments</span>
          </Link>

          <Link
            to="/garage-owner/job-cards"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/job-cards") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">□</span>
            <span>Job Cards</span>
          </Link>

          <Link
            to="/garage-owner/mechanics"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/mechanics") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">⚿</span>
            <span>Mechanics</span>
          </Link>

          <Link
            to="/garage-owner/inventory"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/inventory") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">◇</span>
            <span>Inventory</span>
          </Link>

          <Link
            to="/garage-owner/packages"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/packages") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">⬡</span>
            <span>Packages</span>
          </Link>

          <Link
            to="/garage-owner/billing"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/billing") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">☆</span>
            <span>Billing</span>
          </Link>

          <Link
            to="/garage-owner/follow-up"
            className={`garage-packages-nav-item ${
              isActive("/garage-owner/follow-up") ? "active" : ""
            }`}
          >
            <span className="garage-packages-nav-icon">▱</span>
            <span>Follow-up</span>
          </Link>

          <button
            type="button"
            className="garage-packages-nav-item disabled"
            onClick={() => alert("AI Hub page will be added next.")}
          >
            <span className="garage-packages-nav-icon">◉</span>
            <span>AI Hub</span>
          </button>

          <button
            type="button"
            className="garage-packages-nav-item disabled"
            onClick={() => alert("Reports page will be added next.")}
          >
            <span className="garage-packages-nav-icon">▥</span>
            <span>Reports</span>
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="garage-packages-sidebar-bottom">
          ‹
        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}
      <div className="garage-packages-main">

        {/* HEADER */}
        <header className="garage-packages-header">

          <div className="garage-packages-breadcrumb">
            <span>SmartGarage</span>
            <b>/</b>
            <strong>Packages</strong>
          </div>

          <div className="garage-packages-header-actions">

            <span className="garage-packages-owner-badge">
              GARAGE OWNER
            </span>

            <span className="garage-packages-ai-alerts">
              <span className="garage-packages-alert-dot"></span>
              3 AI alerts
            </span>

            <button
              type="button"
              className="garage-packages-settings"
            >
              ⚙
            </button>

          </div>

        </header>

        {/* =========================
            CONTENT
        ========================= */}
        <main className="garage-packages-content">

          <div className="garage-packages-coming">

            <h1>PACKAGES</h1>

            <p>Coming soon.</p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default PackagesPage;