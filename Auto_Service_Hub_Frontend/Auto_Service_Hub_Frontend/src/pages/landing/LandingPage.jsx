import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

import jobCardImage from "../../assets/job-card.png";
import retentionImage from "../../assets/retention.png";

function LandingPage() {
  return (
    <div className="landing-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="landing-navbar">

        <div className="landing-logo">

          <div className="landing-logo-icon">
            ⌂
          </div>

          <div>
            <div className="landing-logo-title">
              Auto_Service_Hub
            </div>

            <div className="landing-logo-subtitle">
              AI CRM
            </div>
          </div>

        </div>


        <nav className="landing-nav">

          <a href="#features">
            Features
          </a>

          <a href="#modules">
            Modules
          </a>

          <a href="#ai">
            AI Engine
          </a>

          <a href="#pricing">
            Pricing
          </a>

          <a href="#about">
            About
          </a>

        </nav>


        <div className="landing-nav-buttons">

          {/* SIGN IN → SELECT MODULE */}

          <Link
            to="/modules"
            className="landing-signin"
          >
            Sign In
          </Link>


          {/* GET ACCESS → SELECT MODULE */}

          <Link
            to="/modules"
            className="landing-access"
          >
            Get Access →
          </Link>

        </div>

      </header>


      {/* =====================================================
          SECTION 1 — DIGITAL JOB CARD
      ===================================================== */}

      <section
        className="landing-feature-section"
        id="features"
      >

        <div className="landing-feature-image">

          <img
            src={jobCardImage}
            alt="Car service garage"
          />

        </div>


        <div className="landing-feature-content">

          <div className="landing-section-label">
            — DIGITAL JOB CARD
          </div>


          <h1>
            ZERO PAPERWORK.
            <br />
            COMPLETE
            <br />
            VISIBILITY.
          </h1>


          <p>
            Every repair tracked from reception to delivery.
            Mechanics update tasks in real time.
          </p>


          <div className="landing-process">

            <span>
              Vehicle Received
            </span>

            <b>
              →
            </b>

            <span>
              Inspection
            </span>

            <b>
              →
            </b>

            <span>
              Repair
            </span>

            <b>
              →
            </b>

            <span>
              Quality Check
            </span>

            <b>
              →
            </b>

            <span>
              Delivered
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          SECTION 2 — CUSTOMER RETENTION
      ===================================================== */}

      <section
        className="landing-retention-section"
        id="modules"
      >

        <div className="landing-retention-content">

          <div className="landing-section-label">
            — CUSTOMER RETENTION
          </div>


          <h2>
            REPEAT SERVICE.
            <br />
            LOYAL
            <br />
            CUSTOMERS.
          </h2>


          <p>
            Automated reminders, WhatsApp follow-up,
            feedback collection and loyalty tier management.
          </p>


          <div className="landing-stats">

            <div className="landing-stat">

              <strong>
                78%
              </strong>

              <span>
                Repeat Rate
              </span>

            </div>


            <div className="landing-stat">

              <strong>
                4.7★
              </strong>

              <span>
                Avg Rating
              </span>

            </div>


            <div className="landing-stat">

              <strong>
                3.2×
              </strong>

              <span>
                Retention
              </span>

            </div>

          </div>

        </div>


        <div className="landing-retention-image">

          <img
            src={retentionImage}
            alt="Mechanic working on car"
          />

        </div>

      </section>


      {/* =====================================================
          FEATURED IN
      ===================================================== */}

      <section className="landing-featured-section">

        <div className="landing-featured-title">
          FEATURED IN
        </div>


        <div className="landing-featured-logos">

          <span>
            TOPGEAR INDIA
          </span>

          <span>
            AUTOCAR INDIA
          </span>

          <span>
            NDTV AUTO
          </span>

          <span>
            CARWALE
          </span>

          <span>
            ZIGWHEELS
          </span>

          <span>
            TEAM-BHP
          </span>

        </div>

      </section>


      {/* =====================================================
          SECTION 3 — ACCESS
      ===================================================== */}

      <section
        className="landing-access-section"
        id="about"
      >

        {/* LEFT CONTENT */}

        <div className="landing-access-content">

          <div className="landing-section-label">
            — ACCESS
          </div>


          <h2>
            MANAGE THE
            <br />
            FUTURE.
          </h2>


          <p>
            Auto_Service_Hub for automobile workshops,
            multi-bay service centres and franchise networks.
          </p>

        </div>


        {/* RIGHT FORM */}

        <div className="landing-access-card">

          <h3>
            REQUEST PLATFORM ACCESS
          </h3>


          <form>

            {/* NAME */}

            <div className="landing-name-row">

              <input
                type="text"
                placeholder="First Name"
              />

              <input
                type="text"
                placeholder="Last Name"
              />

            </div>


            {/* EMAIL */}

            <input
              type="email"
              placeholder="Email"
            />


            {/* PHONE */}

            <input
              type="tel"
              placeholder="Phone"
            />


            {/* WORKSHOP */}

            <input
              type="text"
              placeholder="Workshop name and number of bays..."
            />


            {/* SUBMIT */}

            <Link
              to="/modules"
              className="landing-submit"
            >
              SUBMIT INQUIRY →
            </Link>

          </form>

        </div>

      </section>

    </div>
  );
}

export default LandingPage;