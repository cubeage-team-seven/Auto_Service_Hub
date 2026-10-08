import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApiLogin } from "../../hooks/useApiLogin";
import "./BillingPage.css";

function BillingLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { submitForm, error, loading } = useApiLogin("/billing/dashboard");

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

          <form onSubmit={submitForm}>
            {error && <p role="alert" className="login-error">{error}</p>}
            <div className="input-field">
              <label>EMAIL ADDRESS OR USERNAME</label>
              <input type="text" name="username" autoComplete="username" placeholder="Email or username" required />
            </div>

            <div className="input-field">
              <label>PASSWORD</label>
              <div className="pass-wrap">
                <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" required />
                <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-access" disabled={loading}>
              {loading ? "SIGNING IN..." : "ACCESS PLATFORM →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default BillingLogin;