import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceAdvisorLogin.css";

export default function ServiceAdvisorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("deshmukh.dwarakadhish@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate directly into the workspace
    navigate("/service-advisor");
  };

  return (
    <div className="sa-login-container">
      {/* Left Visual Banner Section */}
      <div className="sa-login-banner">
        <button className="sa-login-back" onClick={() => navigate("/")}>
          ‹ Back to Site
        </button>
        
        <div className="sa-login-banner-content">
          <div className="sa-login-kicker">— AI-POWERED PLATFORM</div>
          <h1 className="sa-login-hero-title">
            SMART.<br />
            GARAGE.<br />
            AI.
          </h1>
          <p className="sa-login-subtitle">
            Manage every aspect of your workshop — customers, jobs, inventory, billing and AI insights.
          </p>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="sa-login-form-area">
        <div className="sa-login-box">
          
          {/* Header & Role Selector */}
          <div className="sa-login-header">
            <div className="sa-login-brand">
              <div className="sa-logo-icon">◆</div>
              <div>
                <div className="sa-brand-name">SMARTGARAGE AI CRM</div>
                <div className="sa-brand-sub">Select your role to continue</div>
              </div>
            </div>

            <button className="sa-change-role-btn" onClick={() => navigate("/modules")}>
              ← Change Role
            </button>

            <div className="sa-selected-role-card">
              <div className="sa-role-icon">📋</div>
              <div>
                <div className="sa-role-title">Service Advisor</div>
                <div className="sa-role-sub">Front Desk</div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <form className="sa-login-form" onSubmit={handleSubmit}>
            <div className="sa-login-title-group">
              <h2 className="sa-form-title">SIGN IN</h2>
              <p className="sa-form-desc">
                Enter your credentials to access the Service Advisor workspace.
              </p>
            </div>

            <div className="sa-field">
              <label className="sa-label">EMAIL ADDRESS</label>
              <input
                type="email"
                className="sa-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="sa-field">
              <label className="sa-label">PASSWORD</label>
              <input
                type="password"
                className="sa-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="sa-form-options">
              <label className="sa-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="sa-forgot-link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="sa-submit-btn">
              ACCESS PLATFORM →
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}