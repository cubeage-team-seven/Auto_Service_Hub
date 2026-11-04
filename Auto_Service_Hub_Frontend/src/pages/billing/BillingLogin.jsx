import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./BillingPage.css";

function BillingLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await login(formData.get("username"), formData.get("password"));
      navigate("/billing/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
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
            {error && <p role="alert">{error}</p>}
            <div className="input-field">
              <label>EMAIL ADDRESS</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </div>

            <div className="input-field">
              <label>PASSWORD</label>
              <div className="pass-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />
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