import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./GarageOwnerLayout.css";

function GarageOwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/garage-owner/dashboard",
      icon: "▦",
    },
    {
      label: "Customers",
      path: "/garage-owner/customers",
      icon: "♧",
    },
    {
      label: "Vehicles",
      path: "/garage-owner/vehicles",
      icon: "▱",
    },
    {
      label: "Appointments",
      path: "/garage-owner/appointments",
      icon: "□",
    },
    {
      label: "Job Cards",
      path: "/garage-owner/jobcards",
      icon: "▢",
    },
    {
      label: "Mechanics",
      path: "/garage-owner/mechanics",
      icon: "⚒",
    },
    {
      label: "Inventory",
      path: "/garage-owner/inventory",
      icon: "◇",
    },
    {
      label: "Packages",
      path: "/garage-owner/packages",
      icon: "⬡",
    },
    {
      label: "Billing",
      path: "/garage-owner/billing",
      icon: "☆",
    },
    {
      label: "Follow-up",
      path: "/garage-owner/follow-up",
      icon: "□",
    },
    {
      label: "AI Hub",
      path: "/garage-owner/ai-hub",
      icon: "?",
    },
    {
      label: "Reports",
      path: "/garage-owner/reports",
      icon: "▥",
    },
  ];

  const getPageName = () => {
    const pathname = location.pathname;

    if (
      pathname === "/garage-owner" ||
      pathname === "/garage-owner/" ||
      pathname === "/garage-owner/dashboard"
    ) {
      return "Dashboard";
    }

    if (pathname.includes("/customers")) {
      return "Customers";
    }

    if (pathname.includes("/vehicles")) {
      return "Vehicles";
    }

    if (pathname.includes("/appointments")) {
      return "Appointments";
    }

    if (pathname.includes("/jobcards")) {
      return "Job Cards";
    }

    if (pathname.includes("/mechanics")) {
      return "Mechanics";
    }

    if (pathname.includes("/inventory")) {
      return "Inventory";
    }

    if (pathname.includes("/packages")) {
      return "Packages";
    }

    if (pathname.includes("/billing")) {
      return "Billing";
    }

    if (pathname.includes("/follow-up")) {
      return "Follow-up";
    }

    if (pathname.includes("/ai-hub")) {
      return "AI Hub";
    }

    if (pathname.includes("/reports")) {
      return "Reports";
    }

    return "Dashboard";
  };

  return (
    <div
      className={`garage-owner-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="garage-owner-sidebar">

        {/* BRAND */}

        <div className="garage-owner-brand">

          <div className="garage-owner-brand-icon">
            <span></span>
          </div>

          <div className="garage-owner-brand-name">
            SMARTGARAGE
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="garage-owner-nav">

          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `garage-owner-nav-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="garage-owner-nav-icon">
                {item.icon}
              </span>

              <span className="garage-owner-nav-label">
                {item.label}
              </span>
            </NavLink>
          ))}

        </nav>


        {/* =================================================
            SIDEBAR OPEN / CLOSE
        ================================================= */}

        <button
          type="button"
          className="garage-owner-sidebar-collapse"
          onClick={() =>
            setSidebarOpen((prev) => !prev)
          }
          aria-label={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
        >
          {sidebarOpen ? "‹" : "›"}
        </button>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="garage-owner-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="garage-owner-header">

          {/* BREADCRUMB */}

          <div className="garage-owner-breadcrumb">

            <span>
              SmartGarage
            </span>

            <b>
              /
            </b>

            <strong>
              {getPageName()}
            </strong>

          </div>


          {/* HEADER ACTIONS */}

          <div className="garage-owner-header-actions">

            <div className="garage-owner-role">
              GARAGE OWNER
            </div>


            <div className="garage-owner-alerts">

              <span className="garage-owner-alert-dot"></span>

              3 AI alerts

            </div>


            {/* =================================================
                SETTINGS / LANDING BUTTON

                Clicking this button goes to "/"
            ================================================= */}

            <button
              className="garage-owner-settings"
              type="button"
              onClick={() => navigate("/")}
              aria-label="Go to landing page"
            >
              ⚙
            </button>

          </div>

        </header>


        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <section className="garage-owner-content">

          <Outlet />

        </section>

      </main>

    </div>
  );
}

export default GarageOwnerLayout;