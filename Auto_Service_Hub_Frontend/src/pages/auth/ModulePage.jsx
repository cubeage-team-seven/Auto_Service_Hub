import React from "react";
import { Link } from "react-router-dom";
import "./ModulePage.css";

function ModulePage() {
  return (
    <div className="module-page">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <section className="module-left">

        <Link
          to="/"
          className="module-back"
        >
          ← Back to Site
        </Link>

        <div className="module-left-overlay"></div>

        <div className="module-brand-content">

          <div className="module-label">
            — AI-POWERED PLATFORM
          </div>

          <h1>
            AUTO
            <br />
            SERVICES
            <br />
            <span>HUB</span>
          </h1>

          <p>
            Manage every aspect of your workshop — customers,
            jobs, inventory, billing and AI insights.
          </p>

        </div>

      </section>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <section className="module-right">

        <div className="module-container">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="module-brand">

            <div className="module-brand-icon">
              ▰
            </div>

            <div>

              <div className="module-brand-title">
                 Auto_Service_Hub
              </div>

              <div className="module-brand-subtitle">
                Select your role to continue
              </div>

            </div>

          </div>


          {/* =================================================
              MODULE HEADING
          ================================================= */}

          <div className="module-heading">

            <div className="module-label">
              — WORKSPACE
            </div>

            <h2>
              SELECT MODULE
            </h2>

            <p>
              Choose your workspace to continue.
            </p>

          </div>


          {/* =================================================
              MODULE LIST
          ================================================= */}

          <div className="module-list">


            {/* =================================================
                GARAGE OWNER
            ================================================= */}

            <div className="module-card">

              <div className="module-card-icon">
                🏢
              </div>

              <div className="module-card-content">

                <h3>
                  Garage Owner
                </h3>

                <span>
                  Workshop Management
                </span>

                <p>
                  Manage your workshop,
                  staff, customers and business.
                </p>

              </div>

              <span className="module-arrow">
                →
              </span>

            </div>


              {/* SERVICE ADVISOR LINK */}
              <Link
                to="/service-advisor-login"
                className="module-card module-card-link"
              >
                <div className="module-card-icon">📋</div>
                <div className="module-card-content">
                  <h3>Service Advisor</h3>
                  <span>Customer &amp; Job Management</span>
                  <p>
                    Handle customers, job cards, estimates and service updates.
                  </p>
                </div>
                <span className="module-arrow">→</span>
              </Link>


            {/* =================================================
                MECHANIC
            ================================================= */}

            <Link
              to="/mechanic"
              className="module-card module-card-link"
            >

              <div className="module-card-icon">
                🔧
              </div>

              <div className="module-card-content">

                <h3>
                  Mechanic
                </h3>

                <span>
                  Technician
                </span>

                <p>
                  Assigned jobs, repair tasks,
                  notes, parts used and status updates.
                </p>

              </div>

              <span className="module-arrow">
                →
              </span>

            </Link>


            {/* =================================================
                INVENTORY MANAGER
            ================================================= */}

            <Link
              to="/inventory-login"
              className="module-card module-card-link"
            >

              <div className="module-card-icon">
                📦
              </div>

              <div className="module-card-content">

                <h3>
                  Inventory Manager
                </h3>

                <span>
                  Inventory & Procurement
                </span>

                <p>
                  Parts, suppliers, purchases,
                  stock movements and alerts.
                </p>

              </div>

              <span className="module-arrow">
                →
              </span>

            </Link>
          {/* BILLING */}
          <Link to="/billing" className="module-card module-card-link">
            <div className="module-card-icon">₹</div>
            <div className="module-card-content">
              <h3>Billing</h3>
              <span>Payments & Invoicing</span>
              <p>Manage invoices, payments, taxes and financial records.</p>
            </div>
            <span className="module-arrow">→</span>
          </Link>

            {/* =================================================
                CUSTOMER
            ================================================= */}

            <Link to="/customers" className="module-card module-card-link">
                <div className="module-card-icon">👤</div>
                <div className="module-card-content">
                  <h3>Customer</h3>
                  <span>Customer Portal</span>
                  <p>View service history, appointments and vehicle details.</p>
                </div>
                <span className="module-arrow">→</span>
              </Link>


            {/* =================================================
                DEVELOPER
            ================================================= */}

            <div className="module-card">

              <div className="module-card-icon">
                &lt;/&gt;
              </div>

              <div className="module-card-content">

                <h3>
                  Developer
                </h3>

                <span>
                  API & System Management
                </span>

                <p>
                  Manage integrations,
                  APIs and system configuration.
                </p>

              </div>

              <span className="module-arrow">
                →
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ModulePage;