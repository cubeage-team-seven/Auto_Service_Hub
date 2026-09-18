import React, { useState } from "react";
import "./GarageOwnerJobCards.css";

function GarageOwnerJobCards() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    appointment: "Create without appointment",
    customer: "",
    vehicle: "",
    odometer: "43200",
    serviceType: "Basic Service",
    mechanic: "Auto-assign via AI",
    complaint: "",
    delivery: "",
    cost: "0",
    notes: "",
  });

  const jobCards = [
    {
      id: "JC-2408",
      customer: "Arjun Mehta",
      vehicle: "MH-12-AB-4521 | Swift",
      service: "Engine Overhaul",
      mechanic: "Ravi Kumar",
      status: "In Repair",
      statusClass: "repair",
      eta: "Today 5:00 PM",
      amount: "₹18,500",
      progress: 62,
    },
    {
      id: "JC-2407",
      customer: "Priya Sharma",
      vehicle: "DL-01-CZ-9834 | Creta",
      service: "Full Service",
      mechanic: "Amit Patel",
      status: "Quality Check",
      statusClass: "quality",
      eta: "Today 3:30 PM",
      amount: "₹8,200",
      progress: 82,
    },
    {
      id: "JC-2406",
      customer: "Rohit Desai",
      vehicle: "GJ-05-XY-7712 | Innova",
      service: "AC Repair + Service",
      mechanic: "Suresh Nair",
      status: "Delivered",
      statusClass: "delivered",
      eta: "Delivered",
      amount: "₹12,400",
      progress: 100,
    },
    {
      id: "JC-2405",
      customer: "Neha Joshi",
      vehicle: "MH-14-PQ-3356 | City",
      service: "Brake Replacement",
      mechanic: "Ravi Kumar",
      status: "Inspection",
      statusClass: "inspection",
      eta: "Today 6:00 PM",
      amount: "₹4,800",
      progress: 38,
    },
    {
      id: "JC-2404",
      customer: "Vikram Singh",
      vehicle: "UP-32-GH-1190 | Fortuner",
      service: "Suspension + Tyres",
      mechanic: "Amit Patel",
      status: "Received",
      statusClass: "received",
      eta: "Tomorrow 12:00 PM",
      amount: "₹32,000",
      progress: 20,
    },
    {
      id: "JC-2403",
      customer: "Kavita Rao",
      vehicle: "KA-03-MN-5567 | Baleno",
      service: "Basic Service",
      mechanic: "Deepak Verma",
      status: "Delivered",
      statusClass: "delivered",
      eta: "Delivered",
      amount: "₹3,200",
      progress: 100,
    },
  ];

  const filterMap = {
    RECEIVED: "Received",
    INSPECTION: "Inspection",
    REPAIR: "In Repair",
    QC: "Quality Check",
    DELIVERED: "Delivered",
  };

  const filteredJobs =
    activeFilter === "ALL"
      ? jobCards
      : jobCards.filter(
          (job) => job.status === filterMap[activeFilter]
        );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      appointment: "Create without appointment",
      customer: "",
      vehicle: "",
      odometer: "43200",
      serviceType: "Basic Service",
      mechanic: "Auto-assign via AI",
      complaint: "",
      delivery: "",
      cost: "0",
      notes: "",
    });
  };

  const handleCreateJobCard = (e) => {
    e.preventDefault();

    if (!formData.customer || !formData.vehicle) {
      alert("Please select a customer and vehicle.");
      return;
    }

    alert("Job Card created successfully.");

    setShowModal(false);
    resetForm();
  };

  return (
    <div className="garage-jobcards-content">

      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="jobcards-heading-row">

        <h1>JOB CARDS</h1>

        <button
          className="new-jobcard-button"
          onClick={() => setShowModal(true)}
        >
          + NEW JOB CARD
        </button>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="jobcard-stats">

        <div className="jobcard-stat-card">
          <div className="jobcard-stat-label">
            TOTAL TODAY
          </div>

          <div className="jobcard-stat-value">
            14
          </div>
        </div>


        <div className="jobcard-stat-card">
          <div className="jobcard-stat-label">
            IN REPAIR
          </div>

          <div className="jobcard-stat-value lime">
            4
          </div>
        </div>


        <div className="jobcard-stat-card">
          <div className="jobcard-stat-label">
            QC
          </div>

          <div className="jobcard-stat-value">
            2
          </div>
        </div>


        <div className="jobcard-stat-card">
          <div className="jobcard-stat-label">
            DELIVERED
          </div>

          <div className="jobcard-stat-value">
            6
          </div>
        </div>


        <div className="jobcard-stat-card">
          <div className="jobcard-stat-label">
            OVERDUE
          </div>

          <div className="jobcard-stat-value">
            1
          </div>
        </div>

      </section>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="jobcard-filters">

        {[
          "ALL",
          "RECEIVED",
          "INSPECTION",
          "REPAIR",
          "QC",
          "DELIVERED",
        ].map((filter) => (

          <button
            key={filter}
            className={
              activeFilter === filter
                ? "jobcard-filter active"
                : "jobcard-filter"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>

        ))}

      </div>


      {/* =====================================================
          JOB CARDS LIST
      ===================================================== */}

      <div className="jobcards-list">

        {filteredJobs.map((job) => (

          <div
            className="jobcard-item"
            key={job.id}
          >

            {/* TOP SECTION */}

            <div className="jobcard-top">

              {/* LEFT */}

              <div className="jobcard-left">

                <div className="jobcard-id">
                  {job.id}
                </div>

                <div className="jobcard-customer">
                  {job.customer}
                </div>

                <div className="jobcard-vehicle">
                  {job.vehicle}
                </div>

              </div>


              {/* SERVICE */}

              <div className="jobcard-service">

                <span>
                  Service
                </span>

                <strong>
                  {job.service}
                </strong>

                <small>
                  Mechanic: {job.mechanic}
                </small>

              </div>


              {/* RIGHT */}

              <div className="jobcard-right">

                <span
                  className={`jobcard-status ${job.statusClass}`}
                >
                  {job.status}
                </span>

                <div className="jobcard-eta">
                  {job.eta}
                </div>

                <div className="jobcard-amount">
                  {job.amount}
                </div>

                <button
                  className="jobcard-details"
                  onClick={() =>
                    alert(`Details for ${job.id}`)
                  }
                >
                  Details
                </button>

              </div>

            </div>


            {/* PROGRESS */}

            <div className="jobcard-progress">

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${job.progress}%`,
                  }}
                ></div>

              </div>


              <div className="progress-labels">

                <span>
                  Received
                </span>

                <span>
                  Inspection
                </span>

                <span>
                  In Repair
                </span>

                <span>
                  QC
                </span>

                <span>
                  Delivered
                </span>

              </div>

            </div>

          </div>

        ))}


        {filteredJobs.length === 0 && (
          <div className="no-jobcards">
            No job cards found.
          </div>
        )}

      </div>


      {/* =====================================================
          NEW JOB CARD MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="jobcard-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >

          <div className="jobcard-modal">

            {/* MODAL HEADER */}

            <div className="jobcard-modal-header">

              <h2>
                NEW JOB CARD
              </h2>

              <button
                type="button"
                className="jobcard-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="jobcard-form"
              onSubmit={handleCreateJobCard}
            >

              {/* APPOINTMENT */}

              <div className="jobcard-form-group">

                <label>
                  FROM APPOINTMENT
                </label>

                <select
                  name="appointment"
                  value={formData.appointment}
                  onChange={handleChange}
                >

                  <option>
                    Create without appointment
                  </option>

                  <option>
                    APT-0881 — Vikram Singh
                  </option>

                  <option>
                    APT-0882 — Anjali Tiwari
                  </option>

                  <option>
                    APT-0883 — Karan Malhotra
                  </option>

                </select>

              </div>


              {/* CUSTOMER */}

              <div className="jobcard-form-group">

                <label>
                  CUSTOMER
                </label>

                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select customer...
                  </option>

                  <option>
                    Arjun Mehta
                  </option>

                  <option>
                    Priya Sharma
                  </option>

                  <option>
                    Rohit Desai
                  </option>

                  <option>
                    Neha Joshi
                  </option>

                  <option>
                    Vikram Singh
                  </option>

                  <option>
                    Kavita Rao
                  </option>

                </select>

              </div>


              {/* VEHICLE */}

              <div className="jobcard-form-group">

                <label>
                  VEHICLE
                </label>

                <select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select vehicle...
                  </option>

                  <option>
                    MH-12-AB-4521 | Swift
                  </option>

                  <option>
                    DL-01-CZ-9834 | Creta
                  </option>

                  <option>
                    GJ-05-XY-7712 | Innova
                  </option>

                  <option>
                    MH-14-PQ-3356 | City
                  </option>

                  <option>
                    UP-32-GH-1190 | Fortuner
                  </option>

                  <option>
                    KA-03-MN-5567 | Baleno
                  </option>

                </select>

              </div>


              {/* ODOMETER */}

              <div className="jobcard-form-group">

                <label>
                  ODOMETER READING (KM)
                </label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                />

              </div>


              {/* SERVICE */}

              <div className="jobcard-form-group">

                <label>
                  SERVICE TYPE
                </label>

                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                >

                  <option>
                    Basic Service
                  </option>

                  <option>
                    Full Service
                  </option>

                  <option>
                    Engine Overhaul
                  </option>

                  <option>
                    AC Service
                  </option>

                  <option>
                    Brake Replacement
                  </option>

                  <option>
                    Battery Replacement
                  </option>

                  <option>
                    Suspension & Tyres
                  </option>

                </select>

              </div>


              {/* MECHANIC */}

              <div className="jobcard-form-group">

                <label>
                  ASSIGN MECHANIC
                </label>

                <select
                  name="mechanic"
                  value={formData.mechanic}
                  onChange={handleChange}
                >

                  <option>
                    Auto-assign via AI
                  </option>

                  <option>
                    Ravi Kumar
                  </option>

                  <option>
                    Amit Patel
                  </option>

                  <option>
                    Suresh Nair
                  </option>

                  <option>
                    Deepak Verma
                  </option>

                  <option>
                    Kiran Joshi
                  </option>

                </select>

              </div>


              {/* CUSTOMER COMPLAINT */}

              <div className="jobcard-form-group">

                <label>
                  CUSTOMER COMPLAINT
                </label>

                <textarea
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  placeholder="Describe the customer's complaint in detail..."
                  rows="3"
                ></textarea>

              </div>


              {/* DELIVERY */}

              <div className="jobcard-form-group">

                <label>
                  ESTIMATED DELIVERY
                </label>

                <input
                  type="datetime-local"
                  name="delivery"
                  value={formData.delivery}
                  onChange={handleChange}
                />

              </div>


              {/* COST */}

              <div className="jobcard-form-group">

                <label>
                  ESTIMATED COST (₹)
                </label>

                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                />

              </div>


              {/* NOTES */}

              <div className="jobcard-form-group">

                <label>
                  TECHNICIAN NOTES
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Initial technician observations..."
                  rows="3"
                ></textarea>

              </div>


              {/* FOOTER */}

              <div className="jobcard-modal-footer">

                <button
                  type="submit"
                  className="create-jobcard-button"
                >
                  CREATE JOB CARD
                </button>

                <button
                  type="button"
                  className="cancel-jobcard-button"
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

export default GarageOwnerJobCards;