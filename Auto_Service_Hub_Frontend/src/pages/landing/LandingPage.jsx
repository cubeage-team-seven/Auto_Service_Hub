import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const modules = [
  {
    number: "01",
    title: "CUSTOMER CRM",
    description:
      "Centralized profiles with full service history, communication records, loyalty tracking and 360° view.",
  },
  {
    number: "02",
    title: "DIGITAL JOB CARD",
    description:
      "Complete repair lifecycle — Vehicle Received → Inspection → Repair → QC → Delivered with real-time status.",
  },
  {
    number: "03",
    title: "AI DIAGNOSIS",
    description:
      "AI-assisted diagnosis from complaint text and warning images. Confidence-scored recommendations.",
  },
  {
    number: "04",
    title: "SMART INVENTORY",
    description:
      "Spare parts ledger with supplier management, purchase orders, low-stock alerts and demand forecasting.",
  },
  {
    number: "05",
    title: "GST BILLING",
    description:
      "Estimate-to-invoice workflow with auto GST, discount rules, printable invoices and payment recording.",
  },
  {
    number: "06",
    title: "MECHANIC MANAGER",
    description:
      "Profiles, skills, attendance, live workload and AI-recommended job assignments based on experience.",
  },
];

const aiFeatures = [
  {
    icon: "🔍",
    title: "AI Diagnosis",
    value: "85%+",
  },
  {
    icon: "🤑",
    title: "Cost Estimation",
    value: "Auto",
  },
  {
    icon: "🗓️",
    title: "Maintenance",
    value: "Predictive",
  },
  {
    icon: "📷",
    title: "Damage Detection",
    value: "CV-powered",
  },
  {
    icon: "🔧",
    title: "Mechanic AI",
    value: "Skill-matched",
  },
  {
    icon: "📦",
    title: "Parts Forecast",
    value: "Demand AI",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    workshop: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const goToModule = () => {
    navigate("/modules");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Platform Access Request:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="landing-page">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="landing-navbar">
        <div className="navbar-inner">

          <div
            className="brand"
            onClick={() => scrollToSection("home")}
          >
            <div className="brand-icon">
              <span>◆</span>
            </div>

            <div className="brand-text">
              <div className="brand-name">
                SMARTGARAGE
              </div>

              <div className="brand-badge">
                AI CRM
              </div>
            </div>
          </div>

          <nav className="desktop-nav">

            <button
              onClick={() => scrollToSection("modules")}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("modules")}
            >
              Modules
            </button>

            <button
              onClick={() => scrollToSection("ai-engine")}
            >
              AI Engine
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </button>

            <button
              onClick={() => scrollToSection("about")}
            >
              About
            </button>

          </nav>

          <div className="navbar-actions">

            <button
              className="btn-signin"
              onClick={goToModule}
            >
              Sign In
            </button>

            <button
              className="btn-access"
              onClick={goToModule}
            >
              Get Access →
            </button>

          </div>

        </div>
      </header>


      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-background">

          {/* HERO IMAGE */}
          <div
            className="hero-image"
            style={{
              backgroundImage:
                "url('/assets/landing/hero-bg.jpg')",
            }}
          />

          <div className="hero-overlay" />

        </div>

        <div className="hero-content">

          <div className="hero-eyebrow">
            — THE FUTURE OF WORKSHOP MANAGEMENT
          </div>

          <h1 className="hero-title">
            <span>INTELLIGENT.</span>
            <span>PRECISE.</span>
            <span className="lime-text">
              CONNECTED.
            </span>
          </h1>

          <p className="hero-description">
            The all-new SmartGarage AI CRM. AI-powered diagnosis,
            booking, billing and customer retention — in one platform.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={goToModule}
            >
              ACCESS PLATFORM →
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                scrollToSection("ai-engine")
              }
            >
              <span className="play-icon">
                ▶
              </span>

              WATCH DEMO
            </button>

          </div>

          <div className="hero-slider">
            <span className="active" />
            <span />
            <span />
            <span />
          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="stats-section">

        <div className="stats-grid">

          <div className="stat-item">

            <div className="stat-number">
              2,400+
            </div>

            <div className="stat-label">
              CUSTOMERS MANAGED
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-number">
              18,000
            </div>

            <div className="stat-label">
              JOBS COMPLETED
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-number">
              6
            </div>

            <div className="stat-label">
              AI CAPABILITIES
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-number">
              99.2%
            </div>

            <div className="stat-label">
              UPTIME SLA
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODULES
      ====================================================== */}
      <section
        id="modules"
        className="modules-section section"
      >

        <div className="section-heading-row">

          <div className="section-heading-left">

            <div className="section-eyebrow">
              — THE MODULES
            </div>

            <h2 className="section-title">
              BUILT TO
              <br />
              MANAGE.
            </h2>

          </div>

          <div className="section-heading-right">

            <p>
              Twelve integrated modules covering every stage
              of the workshop lifecycle. One platform. Zero gaps.
            </p>

          </div>

        </div>


        <div className="modules-grid">

          {modules.map((module) => (

            <div
              className="module-card"
              key={module.number}
            >

              <div className="module-number">
                {module.number}
              </div>

              <h3>
                {module.title}
              </h3>

              <p>
                {module.description}
              </p>

              <div className="module-line" />

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          AI ENGINE
      ====================================================== */}
      <section
        id="ai-engine"
        className="ai-section section"
      >

        <div className="ai-content">

          <div className="section-eyebrow">
            — SMARTGARAGE AI ENGINE
          </div>

          <h2 className="section-title ai-title">
            DIAGNOSE.
            <br />
            PREDICT.
            <br />
            <span className="lime-text">
              AUTOMATE.
            </span>
          </h2>

          <p className="section-description">
            AI-assisted diagnosis, maintenance prediction,
            damage detection and smart mechanic assignment —
            all with human-approval governance.
          </p>


          <div className="ai-feature-grid">

            {aiFeatures.map((feature) => (

              <div
                className="ai-feature-card"
                key={feature.title}
              >

                <div className="ai-feature-icon">
                  {feature.icon}
                </div>

                <div className="ai-feature-content">

                  <strong>
                    {feature.title}
                  </strong>

                  <span>
                    {feature.value}
                  </span>

                </div>

              </div>

            ))}

          </div>


          <button
            className="primary-button ai-button"
            onClick={goToModule}
          >
            EXPLORE AI HUB →
          </button>

        </div>


        {/* AI IMAGE */}
        <div className="ai-visual">

          <div
            className="ai-image"
            style={{
              backgroundImage:
                "url('/assets/landing/ai-engine.png')",
            }}
          />

          <div className="diagnosis-box">

            <div className="diagnosis-top">

              <span>
                🔍 AI Diagnosis Active
              </span>

              <strong>
                96% confidence
              </strong>

            </div>

            <div className="confidence-bar">
              <span />
            </div>

            <p>
              Battery degradation detected —
              Recommend load test
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          DIGITAL JOB CARD
      ====================================================== */}
      <section className="job-card-section section">

        {/* JOB CARD IMAGE */}
        <div className="job-card-image">

          <div
            className="garage-image"
            style={{
              backgroundImage:
                "url('/assets/landing/job-card.png')",
            }}
          />

        </div>


        <div className="job-card-content">

          <div className="section-eyebrow">
            — DIGITAL JOB CARD
          </div>

          <h2 className="section-title">
            ZERO PAPERWORK.
            <br />
            COMPLETE
            <br className="desktop-break" />
            VISIBILITY.
          </h2>

          <p className="section-description">
            Every repair tracked from reception to delivery.
            Mechanics update tasks in real time.
          </p>


          <div className="job-flow">

            <div className="flow-item">
              Vehicle Received
            </div>

            <span>→</span>

            <div className="flow-item">
              Inspection
            </div>

            <span>→</span>

            <div className="flow-item">
              Repair
            </div>

            <span>→</span>

            <div className="flow-item">
              Quality Check
            </div>

            <span>→</span>

            <div className="flow-item">
              Delivered
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CUSTOMER RETENTION
      ====================================================== */}
      <section className="retention-section section">

        <div className="retention-content">

          <div className="section-eyebrow">
            — CUSTOMER RETENTION
          </div>

          <h2 className="section-title">
            REPEAT SERVICE.
            <br />
            LOYAL CUSTOMERS.
          </h2>

          <p className="section-description">
            Automated reminders, WhatsApp follow-up,
            feedback collection and loyalty tier management.
          </p>


          <div className="retention-stats">

            <div className="retention-card">

              <strong>
                78%
              </strong>

              <span>
                Repeat Rate
              </span>

            </div>


            <div className="retention-card">

              <strong>
                4.7★
              </strong>

              <span>
                Avg Rating
              </span>

            </div>


            <div className="retention-card">

              <strong>
                3.2×
              </strong>

              <span>
                Retention
              </span>

            </div>

          </div>

        </div>


        {/* RETENTION IMAGE */}
        <div className="retention-image">

          <div
            className="mechanic-image"
            style={{
              backgroundImage:
                "url('/assets/landing/retention.png')",
            }}
          />

        </div>

      </section>


      {/* =====================================================
          FEATURED IN
      ====================================================== */}
      <section className="featured-section">

        <div className="featured-title">
          FEATURED IN
        </div>

        <div className="featured-logos">

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
            TEAMBHP
          </span>

        </div>

      </section>


      {/* =====================================================
          ACCESS / CONTACT
      ====================================================== */}
      <section
        id="about"
        className="access-section section"
      >

        <div className="access-content">

          <div className="section-eyebrow">
            — ACCESS
          </div>

          <h2 className="section-title">
            MANAGE THE
            <br />
            FUTURE.
          </h2>

          <p className="section-description">
            SmartGarage AI CRM for automobile workshops,
            multi-bay service centres and franchise networks.
          </p>

        </div>


        <div className="access-form-wrapper">

          <form
            className="access-form"
            onSubmit={handleSubmit}
          >

            <h3>
              REQUEST PLATFORM ACCESS
            </h3>


            <div className="form-row">

              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

            </div>


            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />


            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />


            <textarea
              name="workshop"
              placeholder="Workshop name and number of bays..."
              value={formData.workshop}
              onChange={handleChange}
              required
            />


            <button
              type="submit"
              className="submit-button"
            >
              {submitted
                ? "INQUIRY SENT ✓"
                : "SUBMIT INQUIRY →"}
            </button>

          </form>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-brand-title">

              <div className="footer-icon">
                ◆
              </div>

              <span>
                SMARTGARAGE
              </span>

            </div>

            <p>
              AI-Powered Customer Relationship &
              Car Repair Service Management Platform.
            </p>

          </div>


          <div className="footer-column">

            <h4>
              MODULES
            </h4>

            <a href="#modules">
              Customer CRM
            </a>

            <a href="#modules">
              Vehicle Management
            </a>

            <a href="#modules">
              Job Cards
            </a>

            <a href="#modules">
              Mechanic Manager
            </a>

          </div>


          <div className="footer-column">

            <h4>
              AI FEATURES
            </h4>

            <a href="#ai-engine">
              AI Diagnosis
            </a>

            <a href="#ai-engine">
              Cost Estimation
            </a>

            <a href="#ai-engine">
              Maintenance Prediction
            </a>

            <a href="#ai-engine">
              Damage Detection
            </a>

          </div>


          <div className="footer-column">

            <h4>
              COMPANY
            </h4>

            <a href="#about">
              About Us
            </a>

            <a href="#about">
              Sustainability
            </a>

            <a href="#about">
              Careers
            </a>

            <a href="#about">
              News
            </a>

          </div>


          <div className="footer-column">

            <h4>
              SUPPORT
            </h4>

            <a href="#about">
              Documentation
            </a>

            <a href="#about">
              API Reference
            </a>

            <a href="#about">
              Status
            </a>

            <a href="#about">
              Contact
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 SmartGarage AI. All rights reserved.
          </span>

          <div className="footer-legal">

            <a href="#privacy">
              Privacy Policy
            </a>

            <a href="#terms">
              Terms of Use
            </a>

            <a href="#security">
              Security
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;