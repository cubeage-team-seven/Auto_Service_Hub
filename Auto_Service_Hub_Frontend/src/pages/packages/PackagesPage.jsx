import React, { useState } from "react";
import "./PackagesPage.css";

function PackagesPage() {
  const [showModal, setShowModal] = useState(false);

  const [packages, setPackages] = useState([
    {
      id: 1,
      type: "BASIC",
      name: "BASIC SERVICE",
      duration: "2–3 hrs",
      price: "2,499",
      discount: "",
      color: "blue",
      popular: false,
      services: [
        "Engine oil change (3L)",
        "Oil filter replacement",
        "Air filter check",
        "Tyre pressure check",
        "Battery check",
        "Exterior wash",
      ],
      includes: ["Engine Oil 3L", "Oil Filter"],
    },
    {
      id: 2,
      type: "FULL",
      name: "FULL SERVICE",
      duration: "4–5 hrs",
      price: "5,999",
      discount: "10% discount applied",
      color: "lime",
      popular: true,
      services: [
        "All Basic Service items",
        "AC filter replacement",
        "Brake inspection",
        "Steering & suspension check",
        "Wiper blade check",
        "Interior vacuum",
        "Wheel alignment check",
        "Spark plug inspection",
      ],
      includes: ["Engine Oil 5L", "Oil Filter", "AC Filter"],
    },
    {
      id: 3,
      type: "PREMIUM",
      name: "PREMIUM SERVICE",
      duration: "6–8 hrs",
      price: "10,999",
      discount: "5% discount applied",
      color: "purple",
      popular: false,
      services: [
        "All Full Service items",
        "Spark plug replacement (set 4)",
        "Coolant flush & refill",
        "Brake fluid change",
        "Fuel injector cleaning",
        "Throttle body cleaning",
        "TPMS reset",
        "OBD diagnostic scan",
        "Full engine bay cleaning",
      ],
      includes: [
        "Engine Oil 5L",
        "Oil Filter",
        "AC Filter",
        "Spark Plugs Set",
        "Coolant 1L",
      ],
    },
    {
      id: 4,
      type: "AMC",
      name: "AMC PACKAGE",
      duration: "12 months",
      price: "18,999",
      discount: "15% discount applied",
      color: "orange",
      popular: false,
      services: [
        "2× Full Service visits",
        "1× Premium Service visit",
        "Priority appointment booking",
        "Free towing (2 calls/year)",
        "Free car wash (12 visits)",
        "WhatsApp service updates",
        "Dedicated service advisor",
        "Loyalty reward points",
      ],
      includes: ["All consumables included"],
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    duration: "",
    gst: "18",
    discount: "0",
    services: "",
    parts: "",
    color: "lime",
    popular: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.code ||
      !form.price ||
      !form.duration
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newPackage = {
      id: Date.now(),
      type: form.code,
      name: form.name.toUpperCase(),
      duration: form.duration,
      price: Number(form.price).toLocaleString("en-IN"),
      discount:
        Number(form.discount) > 0
          ? `${form.discount}% discount applied`
          : "",
      color: form.color,
      popular: form.popular,
      services: form.services
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      includes: form.parts
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setPackages((prev) => [...prev, newPackage]);

    setForm({
      name: "",
      code: "",
      price: "",
      duration: "",
      gst: "18",
      discount: "0",
      services: "",
      parts: "",
      color: "lime",
      popular: false,
    });

    setShowModal(false);
  };

  const handleApply = (pkg) => {
    alert(`${pkg.name} selected.`);
  };

  const handleEdit = (pkg) => {
    alert(`Edit ${pkg.name} will be connected later.`);
  };

  return (
    <div className="packages-page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="packages-page-header">

        <div>
          <div className="packages-eyebrow">
            SERVICE MANAGEMENT
          </div>

          <h1>SERVICE PACKAGES</h1>
        </div>

        <button
          className="packages-new-button"
          type="button"
          onClick={() => setShowModal(true)}
        >
          + NEW PACKAGE
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}
      <div className="packages-stats">

        <div className="packages-stat-card">
          <div className="packages-stat-label">
            ACTIVE PACKAGES
          </div>

          <div className="packages-stat-value">
            4
          </div>
        </div>

        <div className="packages-stat-card">
          <div className="packages-stat-label">
            AMC CUSTOMERS
          </div>

          <div className="packages-stat-value lime-text">
            38
          </div>
        </div>

        <div className="packages-stat-card">
          <div className="packages-stat-label">
            MONTHLY REVENUE
          </div>

          <div className="packages-stat-value">
            ₹1.8L
          </div>

          <div className="packages-stat-description">
            from packages
          </div>
        </div>

        <div className="packages-stat-card">
          <div className="packages-stat-label">
            AVG PACKAGE VALUE
          </div>

          <div className="packages-stat-value">
            ₹9,624
          </div>
        </div>

      </div>

      {/* =========================
          PACKAGE CARDS
      ========================= */}
      <div className="packages-grid">

        {packages.map((pkg) => (
          <div
            className={`package-card package-${pkg.color} ${
              pkg.popular ? "package-popular" : ""
            }`}
            key={pkg.id}
          >

            {pkg.popular && (
              <div className="package-popular-badge">
                POPULAR
              </div>
            )}

            {/* CARD TOP */}
            <div className="package-card-top">

              <div className="package-icon">
                🔧
              </div>

              <div className="package-type">
                {pkg.type}
              </div>

              <h2>{pkg.name}</h2>

              <div className="package-duration">
                {pkg.duration}
              </div>

            </div>

            {/* PRICE */}
            <div className="package-price-section">

              <div className="package-price">
                ₹{pkg.price}
              </div>

              {pkg.discount ? (
                <div className="package-discount">
                  {pkg.discount}
                </div>
              ) : null}

              <div className="package-gst">
                + 18% GST
              </div>

            </div>

            {/* SERVICES */}
            <div className="package-services">

              {pkg.services.map((service, index) => (
                <div
                  className="package-service"
                  key={`${pkg.id}-${index}`}
                >
                  <span className="package-check">
                    ✓
                  </span>

                  <span>{service}</span>
                </div>
              ))}

            </div>

            {/* INCLUDES */}
            <div className="package-includes">

              <div className="package-includes-title">
                INCLUDES
              </div>

              <div className="package-tags">

                {pkg.includes.map((item, index) => (
                  <span
                    className="package-tag"
                    key={`${pkg.id}-include-${index}`}
                  >
                    {item}
                  </span>
                ))}

              </div>

            </div>

            {/* ACTIONS */}
            <div className="package-actions">

              <button
                type="button"
                className="package-apply-button"
                onClick={() => handleApply(pkg)}
              >
                APPLY PACKAGE
              </button>

              <button
                type="button"
                className="package-edit-button"
                onClick={() => handleEdit(pkg)}
              >
                Edit
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* =========================
          NEW PACKAGE MODAL
      ========================= */}
      {showModal && (
        <div
          className="package-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >

          <div className="package-modal">

            {/* MODAL HEADER */}
            <div className="package-modal-header">

              <h2>NEW SERVICE PACKAGE</h2>

              <button
                type="button"
                className="package-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form
              className="package-form"
              onSubmit={handleCreatePackage}
            >

              {/* PACKAGE NAME */}
              <div className="package-form-group full">
                <label>PACKAGE NAME</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Premium Plus Service"
                />
              </div>

              {/* PACKAGE CODE */}
              <div className="package-form-group full">
                <label>PACKAGE CODE</label>

                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="PREM-PLUS"
                />
              </div>

              {/* PRICE */}
              <div className="package-form-group">
                <label>PRICE (₹)</label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="8999"
                />
              </div>

              {/* DURATION */}
              <div className="package-form-group">
                <label>DURATION / VALIDITY</label>

                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="4–5 hrs / 6 months"
                />
              </div>

              {/* GST */}
              <div className="package-form-group">
                <label>GST RATE (%)</label>

                <select
                  name="gst"
                  value={form.gst}
                  onChange={handleChange}
                >
                  <option value="5">5</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="28">28</option>
                </select>
              </div>

              {/* DISCOUNT */}
              <div className="package-form-group">
                <label>DISCOUNT (%)</label>

                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              {/* SERVICES */}
              <div className="package-form-group full">
                <label>INCLUDED SERVICES</label>

                <textarea
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="Engine oil change, Oil filter, AC filter check, Brake inspection..."
                />
              </div>

              {/* PARTS */}
              <div className="package-form-group full">
                <label>INCLUDED PARTS / CONSUMABLES</label>

                <textarea
                  name="parts"
                  value={form.parts}
                  onChange={handleChange}
                  placeholder="Engine Oil 5L, Oil Filter, AC Filter..."
                />
              </div>

              {/* COLOURS */}
              <div className="package-form-group full">

                <label>
                  PACKAGE COLOUR (FOR UI)
                </label>

                <div className="package-colors">

                  {[
                    "lime",
                    "blue",
                    "purple",
                    "orange",
                    "green",
                    "red",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`package-color-option ${color} ${
                        form.color === color
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          color,
                        }))
                      }
                      aria-label={color}
                    />
                  ))}

                </div>

              </div>

              {/* POPULAR */}
              <div className="package-popular-option full">

                <label className="package-checkbox">

                  <input
                    type="checkbox"
                    name="popular"
                    checked={form.popular}
                    onChange={handleChange}
                  />

                  <span>
                    Show "Popular" badge on this package
                  </span>

                </label>

              </div>

              {/* BUTTONS */}
              <div className="package-modal-actions full">

                <button
                  type="submit"
                  className="package-create-button"
                >
                  CREATE PACKAGE
                </button>

                <button
                  type="button"
                  className="package-cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default PackagesPage;