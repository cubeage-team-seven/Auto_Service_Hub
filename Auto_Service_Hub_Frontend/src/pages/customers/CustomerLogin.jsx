import React from "react";
import { Link } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
  return (
    <div className="login-container">
      {/* LEFT SIDE - BRANDING */}
      <div className="login-left">
        <Link to="/" className="back-link">
          ← Back to Site
        </Link>
        <div className="left-overlay"></div>
        <div className="left-content">
          <span className="brand-tag">— AI-POWERED PLATFORM</span>
          <h1 className="brand-title">
            SMART.<br />
            GARAGE.<br />
            <span className="highlight">AI.</span>
          </h1>
          <p className="brand-desc">
            Manage every aspect of your workshop — customers, jobs, inventory, billing and AI insights.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="login-right">
        <div className="form-wrapper">
          {/* TOP LOGO HEADER */}
          <div className="header-logo">
            <div className="logo-box">▰</div>
            <div>
              <div className="logo-title">SMARTGARAGE AI CRM</div>
              <div className="logo-subtitle">Select your role to continue</div>
            </div>
          </div>

          <Link to="/modules" className="change-role-btn">
            ← Change Role
          </Link>

          {/* ACTIVE ROLE CARD */}
          <div className="active-role-card">
            <span className="role-card-icon">🚗</span>
            <div>
              <div className="role-card-title">Customer</div>
              <div className="role-card-subtitle">Self-Service Portal</div>
            </div>
          </div>

          {/* SIGN IN FORM */}
          <div className="form-section">
            <h2 className="form-title">SIGN IN</h2>
            <p className="form-subtitle">Enter your credentials to access the Customer workspace.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="you@garage.com" defaultValue="you@garage.com" />
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <input type="password" defaultValue="••••••••••••" />
              </div>

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-pass">Forgot password?</a>
              </div>

              <Link to="/dashboard" className="submit-btn">
                ACCESS PLATFORM →
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;