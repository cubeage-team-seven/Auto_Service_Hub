import React, { useState } from "react";
import "./GarageOwnerMechanics.css";

function GarageOwnerMechanics() {
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "Junior Mechanic",
    experience: "3",
    skills: [],
    joiningDate: "",
    salary: "25000",
    governmentId: "",
  });

  const mechanics = [
    {
      id: "M-01",
      name: "Ravi Kumar",
      role: "Senior Mechanic",
      experience: "8 yrs",
      phone: "+91 98100 11223",
      status: "Present",
      statusClass: "present",
      dotClass: "yellow",
      skills: ["Engine", "Transmission", "Electrical"],
      active: 3,
      done: 142,
      rating: "4.9★",
    },
    {
      id: "M-02",
      name: "Amit Patel",
      role: "Senior Mechanic",
      experience: "11 yrs",
      phone: "+91 97200 44556",
      status: "Present",
      statusClass: "present",
      dotClass: "yellow",
      skills: ["AC Repair", "Suspension", "Full Service"],
      active: 2,
      done: 198,
      rating: "4.8★",
    },
    {
      id: "M-03",
      name: "Suresh Nair",
      role: "Mechanic",
      experience: "5 yrs",
      phone: "+91 96300 77889",
      status: "Present",
      statusClass: "present",
      dotClass: "green",
      skills: ["Body Work", "Painting", "Denting"],
      active: 0,
      done: 87,
      rating: "4.6★",
    },
    {
      id: "M-04",
      name: "Deepak Verma",
      role: "Junior Mechanic",
      experience: "3 yrs",
      phone: "+91 95400 00112",
      status: "Present",
      statusClass: "present",
      dotClass: "yellow",
      skills: ["Basic Service", "Tyres", "Brakes"],
      active: 1,
      done: 56,
      rating: "4.5★",
    },
    {
      id: "M-05",
      name: "Kiran Joshi",
      role: "Auto Electrician",
      experience: "6 yrs",
      phone: "+91 94500 33445",
      status: "Leave",
      statusClass: "leave",
      dotClass: "green",
      skills: ["Wiring", "Battery", "AC Electrical"],
      active: 0,
      done: 64,
      rating: "4.7★",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSkillChange = (skill) => {
    setFormData((previous) => {
      const exists = previous.skills.includes(skill);

      return {
        ...previous,
        skills: exists
          ? previous.skills.filter((item) => item !== skill)
          : [...previous.skills, skill],
      };
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      role: "Junior Mechanic",
      experience: "3",
      skills: [],
      joiningDate: "",
      salary: "25000",
      governmentId: "",
    });
  };

  const handleAddMechanic = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Please enter full name and phone number.");
      return;
    }

    alert("Mechanic added successfully.");

    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (mechanic) => {
    alert(`Edit ${mechanic.name}`);
  };

  const handleAssignJob = (mechanic) => {
    alert(`Assign job to ${mechanic.name}`);
  };

  const skills = [
    "Engine Repair",
    "Transmission",
    "AC Repair",
    "Suspension",
    "Electrical",
    "Brakes",
    "Body Work",
    "Painting",
    "Full Service",
    "Tyres",
    "Battery",
    "Diagnostics",
  ];

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
            5
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            PRESENT TODAY
          </div>

          <div className="mechanics-stat-value lime">
            4
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            ON LEAVE
          </div>

          <div className="mechanics-stat-value">
            1
          </div>

        </div>


        <div className="mechanics-stat-card">

          <div className="mechanics-stat-label">
            AVG RATING
          </div>

          <div className="mechanics-stat-value">
            4.7★
          </div>

        </div>

      </section>


      {/* =====================================================
          MECHANIC GRID
      ===================================================== */}

      <section className="mechanics-grid">

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
                    className={`mechanic-status-dot ${mechanic.dotClass}`}
                  ></span>

                  <h3>
                    {mechanic.name}
                  </h3>

                </div>

                <div className="mechanic-role">
                  {mechanic.role} · {mechanic.experience}
                </div>

                <div className="mechanic-phone">
                  {mechanic.phone}
                </div>

              </div>


              <div className="mechanic-status-info">

                <div className="mechanic-id">
                  {mechanic.id}
                </div>

                <div
                  className={`mechanic-presence ${mechanic.statusClass}`}
                >
                  {mechanic.status}
                </div>

              </div>

            </div>


            {/* SKILLS */}

            <div className="mechanic-skills">

              {mechanic.skills.map((skill) => (

                <span
                  className="mechanic-skill"
                  key={skill}
                >
                  {skill}
                </span>

              ))}

            </div>


            {/* DIVIDER */}

            <div className="mechanic-divider"></div>


            {/* STATS */}

            <div className="mechanic-card-stats">

              <div className="mechanic-card-stat">

                <strong>
                  {mechanic.active}
                </strong>

                <span>
                  Active
                </span>

              </div>


              <div className="mechanic-card-stat">

                <strong>
                  {mechanic.done}
                </strong>

                <span>
                  Done
                </span>

              </div>


              <div className="mechanic-card-stat rating">

                <strong>
                  {mechanic.rating}
                </strong>

                <span>
                  Rating
                </span>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="mechanic-divider"></div>


            {/* BUTTONS */}

            <div className="mechanic-card-actions">

              <button
                className="mechanic-edit-button"
                onClick={() => handleEdit(mechanic)}
              >
                Edit
              </button>

              <button
                className="mechanic-assign-button"
                onClick={() => handleAssignJob(mechanic)}
              >
                Assign Job
              </button>

            </div>

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

              {/* NAME + PHONE */}

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


              {/* ROLE */}

              <div className="mechanic-form-group">

                <label>
                  ROLE
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >

                  <option>
                    Junior Mechanic
                  </option>

                  <option>
                    Mechanic
                  </option>

                  <option>
                    Senior Mechanic
                  </option>

                  <option>
                    Auto Electrician
                  </option>

                  <option>
                    Service Technician
                  </option>

                </select>

              </div>


              {/* EXPERIENCE */}

              <div className="mechanic-form-group">

                <label>
                  EXPERIENCE (YEARS)
                </label>

                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                />

              </div>


              {/* SKILLS */}

              <div className="mechanic-form-group">

                <label>
                  SKILLS (SELECT ALL THAT APPLY)
                </label>

                <div className="mechanic-skills-checkbox-grid">

                  {skills.map((skill) => (

                    <label
                      className="mechanic-checkbox-item"
                      key={skill}
                    >

                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() =>
                          handleSkillChange(skill)
                        }
                      />

                      <span>
                        {skill}
                      </span>

                    </label>

                  ))}

                </div>

              </div>


              {/* DATE + SALARY */}

              <div className="mechanic-form-row">

                <div className="mechanic-form-group">

                  <label>
                    DATE OF JOINING
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />

                </div>


                <div className="mechanic-form-group">

                  <label>
                    SALARY (₹/MONTH)
                  </label>

                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />

                </div>

              </div>


              {/* GOVERNMENT ID */}

              <div className="mechanic-form-group">

                <label>
                  GOVERNMENT ID / AADHAAR
                </label>

                <input
                  type="text"
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX"
                />

              </div>


              {/* FOOTER */}

              <div className="mechanic-modal-footer">

                <button
                  type="submit"
                  className="mechanic-submit-button"
                >
                  ADD MECHANIC
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