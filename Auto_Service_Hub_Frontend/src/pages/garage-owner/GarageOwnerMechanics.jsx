import React, { useEffect, useState } from "react";
import { jobCardsApi, mechanicsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerMechanics.css";

function GarageOwnerMechanics() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    phone: "",
    experienceYears: "",
  });

  useEffect(() => {
    Promise.all([mechanicsApi.list(), jobCardsApi.list()])
      .then(([mechanicRecords, jobRecords]) => {
        setMechanics(mechanicRecords);
        setJobs(jobRecords);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddMechanic = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Please enter full name and phone number.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const created = await mechanicsApi.create({
        name: formData.name.trim(),
        employeeCode: formData.employeeCode.trim(),
        phone: formData.phone.trim(),
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : null,
        status: "ACTIVE",
      });
      setMechanics((existing) => [...existing, created]);
      setShowAddModal(false);
      setFormData({ name: "", employeeCode: "", phone: "", experienceYears: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not add mechanic."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="garage-mechanics-content">

      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="mechanics-heading-row">

        <h1>MECHANICS</h1>

        <button
          className="add-mechanic-button"
          onClick={() => setShowAddModal(true)}
        >
          + ADD MECHANIC
        </button>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="mechanics-stats">

        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            TOTAL STAFF
          </div>

          <div className="mechanics-stat-value">
            {mechanics.length}
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            ACTIVE
          </div>

          <div className="mechanics-stat-value lime">
            {mechanics.filter((mechanic) => mechanic.status === "ACTIVE").length}
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            INACTIVE
          </div>

          <div className="mechanics-stat-value">
            {mechanics.filter((mechanic) => mechanic.status !== "ACTIVE").length}
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            AVG EXPERIENCE
          </div>

          <div className="mechanics-stat-value">
            {mechanics.length
              ? `${(mechanics.reduce((sum, mechanic) => sum + (mechanic.experienceYears || 0), 0) / mechanics.length).toFixed(1)} yrs`
              : "—"}
          </div>

        </div>

      </section>


      {/* =====================================================
          MECHANIC GRID
      ===================================================== */}

      <section className="mechanics-grid">

        {loading && <p>Loading mechanics…</p>}
        {!loading && error && <p role="alert" className="login-error">{error}</p>}
        {mechanics.map((mechanic) => (

          <div
            className="mechanic-card"
            key={mechanic.id}
          >

            {/* TOP */}

            <div className="mechanic-card-top">

              <div className="mechanic-main-info">

                <div className="mechanic-name-row">

                  <span
                    className={`mechanic-status-dot ${mechanic.status === "ACTIVE" ? "green" : "yellow"}`}
                  ></span>

                  <h3>
                    {mechanic.name}
                  </h3>

                </div>

                <div className="mechanic-role">
                  {mechanic.employeeCode} · {mechanic.experienceYears ?? 0} yrs experience
                </div>

                <div className="mechanic-phone">
                  {mechanic.phone}
                </div>

              </div>


              <div className="mechanic-status-info">

                <div className="mechanic-id">
                  {mechanic.employeeCode}
                </div>

                <div
                  className={`mechanic-presence ${String(mechanic.status || "").toLowerCase()}`}
                >
                  {mechanic.status}
                </div>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="mechanic-divider"></div>


            {/* STATS */}

            <div className="mechanic-card-stats">

              <div className="mechanic-card-stat">

                <strong>
                  {jobs.filter((job) => job.mechanicId === mechanic.id && job.status !== "DELIVERED").length}
                </strong>

                <span>
                  Active
                </span>

              </div>


              <div className="mechanic-card-stat">

                <strong>
                  {jobs.filter((job) => job.mechanicId === mechanic.id && job.status === "DELIVERED").length}
                </strong>

                <span>
                  Done
                </span>

              </div>


              <div className="mechanic-card-stat rating">

                <strong>
                  {mechanic.experienceYears ?? 0} yrs
                </strong>

                <span>Experience</span>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="mechanic-divider"></div>


          </div>

        ))}

      </section>


      {/* =====================================================
          ADD MECHANIC MODAL
      ===================================================== */}

      {showAddModal && (

        <div
          className="mechanic-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >

          <div className="mechanic-modal">

            {/* MODAL HEADER */}

            <div className="mechanic-modal-header">

              <h2>
                ADD MECHANIC
              </h2>

              <button
                type="button"
                className="mechanic-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="mechanic-form"
              onSubmit={handleAddMechanic}
            >
              {error && <p role="alert" className="login-error">{error}</p>}

              {/* NAME + EMPLOYEE CODE */}

              <div className="mechanic-form-row">

                <div className="mechanic-form-group">

                  <label>
                    FULL NAME
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Rajesh Sharma"
                    required
                  />

                </div>

                <div className="mechanic-form-group">
                  <label>EMPLOYEE CODE</label>
                  <input
                    type="text"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>

              <div className="mechanic-form-row">
                <div className="mechanic-form-group">

                  <label>
                    PHONE
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />

                </div>

              </div>


              {/* EXPERIENCE */}

              <div className="mechanic-form-group">

                <label>
                  EXPERIENCE (YEARS)
                </label>

                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                />

              </div>


              {/* FOOTER */}

              <div className="mechanic-modal-footer">

                <button
                  type="submit"
                  className="mechanic-submit-button"
                  disabled={saving}
                >
                  {saving ? "SAVING..." : "ADD MECHANIC"}
                </button>

                <button
                  type="button"
                  className="mechanic-cancel-button"
                  onClick={() => setShowAddModal(false)}
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

export default GarageOwnerMechanics;