import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";

import "./InventoryLayout.css";

function InventoryLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();

  const isDashboard =
    location.pathname === "/inventory-dashboard";

  const isInventory =
    location.pathname === "/inventory";

  return (
    <div
      className={`inventory-layout ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      }`}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="inventory-layout-sidebar">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="inventory-layout-logo">

          <div className="inventory-layout-logo-icon">
            ◆
          </div>

          <span className="inventory-layout-logo-text">
            Auto_Service_Hub
          </span>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="inventory-layout-nav">

          {/* DASHBOARD */}

          <NavLink
            to="/inventory-dashboard"
            className={`inventory-layout-nav-item ${
              isDashboard ? "active" : ""
            }`}
          >

            <span className="inventory-layout-nav-icon">
              ▦
            </span>

            <span className="inventory-layout-nav-text">
              Dashboard
            </span>

          </NavLink>


          {/* INVENTORY */}

          <NavLink
            to="/inventory"
            className={`inventory-layout-nav-item ${
              isInventory ? "active" : ""
            }`}
          >

            <span className="inventory-layout-nav-icon">
              ◇
            </span>

            <span className="inventory-layout-nav-text">
              Inventory
            </span>

          </NavLink>

        </nav>


        {/* =================================================
            SIDEBAR COLLAPSE
        ================================================= */}

        <button
          type="button"
          className="inventory-layout-toggle"
          onClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
          aria-label={
            sidebarOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >

          <span>
            {sidebarOpen ? "‹" : "›"}
          </span>

        </button>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="inventory-layout-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="inventory-layout-topbar">

          {/* BREADCRUMB */}

          <div className="inventory-layout-breadcrumb">

            <span>
              Auto_Service_Hub
            </span>

            <b>
              /
            </b>

            <strong>
              {isDashboard
                ? "Dashboard"
                : "Inventory"}
            </strong>

          </div>


          {/* =================================================
              RIGHT SIDE ACTIONS
          ================================================= */}

          <div className="inventory-layout-actions">

            {/* ROLE */}

            <span className="inventory-layout-role">
              INVENTORY MANAGER
            </span>


            {/* AI ALERTS */}

            <button
              type="button"
              className="inventory-layout-alerts"
              title="AI Alerts"
            >

              <span className="inventory-layout-alert-dot">
              </span>

              <span>
                AI tools
              </span>

            </button>


            {/* PROFILE / SETTINGS */}

            <Link
              to="/"
              className="inventory-layout-home"
              title="Home"
            >
              ◆
            </Link>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="inventory-layout-content">

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default InventoryLayout;