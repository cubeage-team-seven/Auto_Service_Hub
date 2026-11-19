import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./BillingPage.css";

function BillingLayout() {
  const { user } = useAuth();
  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .replace(/^GARAGE_OWNER$/, "OWNER")
    .replace(/_/g, " ")
    .toUpperCase();

  return (
    <div className="billing-workspace">
      <aside className="billing-workspace-sidebar">
        <Link
          to="/"
          className="billing-workspace-brand"
          aria-label="Auto Service Hub home"
        >
          <span className="billing-workspace-brand-icon" aria-hidden="true">
            A
          </span>
          <span className="billing-workspace-brand-name">Auto Service Hub</span>
        </Link>

        <div className="billing-workspace-section-label">WORKSPACE</div>
        <nav className="billing-workspace-nav" aria-label="Billing workspace">
          <NavLink
            to="/billing/dashboard"
            end
            aria-label="Billing dashboard"
            className={({ isActive }) =>
              `billing-workspace-nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="billing-workspace-nav-icon" aria-hidden="true">
              ▦
            </span>
            <span className="billing-workspace-nav-label">Dashboard</span>
          </NavLink>
          <NavLink
            to="/billing/invoices"
            aria-label="Invoices and payments"
            className={({ isActive }) =>
              `billing-workspace-nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="billing-workspace-nav-icon" aria-hidden="true">
              ▤
            </span>
            <span className="billing-workspace-nav-label">Invoices &amp; Payments</span>
          </NavLink>
        </nav>
      </aside>

      <main className="billing-workspace-main">
        <header className="billing-workspace-header">
          <div className="billing-workspace-breadcrumb">
            <span>Auto Service Hub</span>
            <span aria-hidden="true">/</span>
            <strong>Billing</strong>
          </div>
          <span className="billing-workspace-role">{role || "UNKNOWN ROLE"}</span>
        </header>

        <div className="billing-workspace-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default BillingLayout;
