import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MechanicLayout.css";

function MechanicLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard =
    location.pathname === "/mechanic-dashboard";

  return (
    <div
      className={`mechanic-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="mechanic-sidebar">

        {/* BRAND */}

        <div className="mechanic-brand">
          <div className="mechanic-brand-icon">
            ▰
          </div>

          <div className="mechanic-brand-name">
            SMARTGARAGE
          </div>
        </div>


        {/* NAVIGATION */}

        <nav className="mechanic-navigation">

          <NavLink
            to="/mechanic-dashboard"
            className={({ isActive }) =>
              `mechanic-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="mechanic-nav-icon">
              ▦
            </span>

            <span className="mechanic-nav-text">
              Dashboard
            </span>
          </NavLink>


          <NavLink
            to="/job-cards"
            className={({ isActive }) =>
              `mechanic-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="mechanic-nav-icon">
              ♧
            </span>

            <span className="mechanic-nav-text">
              Job Cards
            </span>
          </NavLink>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="mechanic-sidebar-footer">

          <button
            type="button"
            className="mechanic-collapse-button"
            onClick={() =>
              setSidebarOpen((previous) => !previous)
            }
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "‹" : "›"}
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mechanic-main">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="mechanic-header">

          <div className="mechanic-breadcrumb">

            <span className="breadcrumb-muted">
              SmartGarage
            </span>

            <span className="breadcrumb-slash">
              /
            </span>

            <strong>
              {isDashboard ? "Dashboard" : "Job Cards"}
            </strong>

          </div>


          <div className="mechanic-header-actions">

            {/* ROLE */}

            <div className="mechanic-role">
              MECHANIC
            </div>


            {/* AI ALERT */}

            <div className="mechanic-ai-alert">

              <span className="mechanic-ai-dot"></span>

              <span>
                3 AI alerts
              </span>

            </div>


            {/* LIME BUTTON */}

            <button
              type="button"
              className="mechanic-header-button"
              onClick={() => navigate("/")}
              title="Go to main page"
              aria-label="Go to main page"
            >
              ✎
            </button>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="mechanic-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default MechanicLayout;