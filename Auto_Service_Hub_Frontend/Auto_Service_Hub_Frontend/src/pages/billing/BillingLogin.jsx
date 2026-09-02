import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BillingPage.css";

function BillingLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/billing/dashboard");
  };

  return (
    <div className="billing-login-container">
      <section className="login-left">
        <Link to="/modules" className="back-site">← Back to Site</Link>
        <div>
          <div className="brand-label">— AI-POWERED PLATFORM</div>
          <h1 className="brand-title">
            SMART.<br />GARAGE.<br /><span className="lime-text">AI.</span>
          </h1>
          <p className="brand-desc">
            Manage every aspect of your workshop — customers, jobs, inventory, billing and AI insights.
          </p>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <Link to="/modules" className="back-site">← Change Role</Link>
          
          <div className="role-badge">
            <div className="role-icon">₹</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "13px" }}>Billing</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Finance User</div>
            </div>
          </div>

          <h2 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 4px" }}>SIGN IN</h2>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
            Enter your credentials to access the Billing workspace.
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-field">
              <label>EMAIL ADDRESS</label>
              <input type="email" defaultValue="you@garage.com" required />
            </div>

            <div className="input-field">
              <label>PASSWORD</label>
              <div className="pass-wrap">
                <input type={showPassword ? "text" : "password"} defaultValue="password123" required />
                <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-access">ACCESS PLATFORM →</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default BillingLogin;