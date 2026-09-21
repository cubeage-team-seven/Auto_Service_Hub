import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeveloperLogin.css";

export default function DeveloperLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("you@garage.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Developer workspace
    navigate("/developer");
  };

  return (
    <div className="developer-login-container">

      {/* =====================================================
          LEFT VISUAL SECTION
      ===================================================== */}
      <div className="developer-login-banner">

        {/* Back Button */}
        <button
          className="developer-login-back"
          onClick={() => navigate("/")}
        >
          ← Back to Site
        </button>

        {/* Dark Overlay */}
        <div className="developer-login-overlay"></div>

        {/* Banner Content */}
        <div className="developer-login-banner-content">

          <div className="developer-login-kicker">
            — AI-POWERED PLATFORM
          </div>

          <h1 className="developer-login-hero-title">
            SMART.
            <br />
            GARAGE.
            <br />
            <span>AI.</span>
          </h1>

          <p className="developer-login-subtitle">
            Manage every aspect of your workshop — customers, jobs,
            inventory, billing and AI insights.
          </p>

        </div>
      </div>


      {/* =====================================================
          RIGHT LOGIN SECTION
      ===================================================== */}
      <div className="developer-login-form-area">

        <div className="developer-login-box">

          {/* =================================================
              BRAND
          ================================================= */}
          <div className="developer-login-header">

            <div className="developer-login-brand">

              <div className="developer-logo-icon">
                ◆
              </div>

              <div>
                <div className="developer-brand-name">
                  SMARTGARAGE AI CRM
                </div>

                <div className="developer-brand-sub">
                  Select your role to continue
                </div>
              </div>

            </div>


            {/* Change Role */}
            <button
              className="developer-change-role-btn"
              onClick={() => navigate("/modules")}
            >
              ← Change Role
            </button>


            {/* Selected Role */}
            <div className="developer-selected-role-card">

              <div className="developer-role-icon">
                &lt;/&gt;
              </div>

              <div>
                <div className="developer-role-title">
                  Developer
                </div>

                <div className="developer-role-sub">
                  QA Engineer
                </div>
              </div>

            </div>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}
          <form
            className="developer-login-form"
            onSubmit={handleSubmit}
          >

            <div className="developer-login-title-group">

              <h2 className="developer-form-title">
                SIGN IN
              </h2>

              <p className="developer-form-desc">
                Enter your credentials to access the Developer workspace.
              </p>

            </div>


            {/* EMAIL */}
            <div className="developer-field">

              <label className="developer-label">
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                className="developer-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* PASSWORD */}
            <div className="developer-field">

              <label className="developer-label">
                PASSWORD
              </label>

              <input
                type="password"
                className="developer-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            {/* OPTIONS */}
            <div className="developer-form-options">

              <label className="developer-checkbox-label">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              <a
                href="#forgot"
                className="developer-forgot-link"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="developer-submit-btn"
            >
              ACCESS PLATFORM →
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}