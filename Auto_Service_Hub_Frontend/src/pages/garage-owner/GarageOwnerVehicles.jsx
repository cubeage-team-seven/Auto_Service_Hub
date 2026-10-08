import React, { useEffect, useMemo, useState } from "react";
import { customersApi, vehiclesApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerVehicles.css";

function GarageOwnerVehicles() {
  const [search, setSearch] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "Maruti Suzuki",
    model: "",
    year: "2022",
    fuelType: "Petrol",
    customer: "",
    mileage: "0",
    engineNo: "",
    chassisNo: "",
    insuranceExpiry: "",
    warrantyExpiry: "",
    notes: "",
  });

  useEffect(() => {
    Promise.all([vehiclesApi.list(), customersApi.list()])
      .then(([vehicleRecords, customerRecords]) => {
        setVehicles(vehicleRecords);
        setCustomers(customerRecords);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !searchValue ||
        vehicle.registrationNo?.toLowerCase().includes(searchValue) ||
        vehicle.customerName?.toLowerCase().includes(searchValue) ||
        vehicle.model?.toLowerCase().includes(searchValue) ||
        vehicle.make?.toLowerCase().includes(searchValue);
      return matchesSearch;
    });
  }, [search, vehicles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegisterVehicle = async (e) => {
    e.preventDefault();

    if (
      !formData.registrationNumber.trim() ||
      !formData.model.trim() ||
      !formData.customer
    ) {
      alert(
        "Please enter Registration Number, Model and Customer / Owner."
      );
      return;
    }

    setError("");
    setSaving(true);
    try {
      const created = await vehiclesApi.create({
        registrationNo: formData.registrationNumber.trim(),
        make: formData.make,
        model: formData.model.trim(),
        year: formData.year ? Number(formData.year) : null,
        engineNo: formData.engineNo.trim() || null,
        chassisNo: formData.chassisNo.trim() || null,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        insuranceExpiry: formData.insuranceExpiry || null,
        warrantyExpiry: formData.warrantyExpiry || null,
        customerId: Number(formData.customer),
      });
      setVehicles((existing) => [created, ...existing]);
      setShowRegisterModal(false);
      setFormData({
        registrationNumber: "",
        make: "Maruti Suzuki",
        model: "",
        year: "",
        fuelType: "Petrol",
        customer: "",
        mileage: "",
        engineNo: "",
        chassisNo: "",
        insuranceExpiry: "",
        warrantyExpiry: "",
        notes: "",
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not register vehicle."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* =====================================================
          VEHICLES PAGE
          Sidebar + Top Header are already provided by
          GarageOwnerLayout.jsx
      ===================================================== */}

      <div className="garage-vehicles-page">

        {/* =========================
            PAGE HEADING
        ========================= */}

        <div className="vehicles-heading-row">
          <h1>VEHICLES</h1>

          <button
            type="button"
            className="register-vehicle-button"
            onClick={() => setShowRegisterModal(true)}
          >
            + REGISTER VEHICLE
          </button>
        </div>


        {/* =========================
            STATISTICS
        ========================= */}

        <section className="vehicle-stats">

          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              TOTAL VEHICLES
            </div>

            <div className="vehicle-stat-value">
              {vehicles.length}
            </div>
          </div>


          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              REGISTERED CUSTOMERS
            </div>

            <div className="vehicle-stat-value lime">
              {customers.length}
            </div>
          </div>


          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              INSURANCE EXPIRING
            </div>

            <div className="vehicle-stat-value">
              {vehicles.filter((vehicle) => {
                if (!vehicle.insuranceExpiry) return false;
                const daysRemaining = (new Date(vehicle.insuranceExpiry) - Date.now()) / 86400000;
                return daysRemaining >= 0 && daysRemaining <= 60;
              }).length}
            </div>

            <div className="vehicle-stat-description">
              within 60 days
            </div>
          </div>


          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              AVG MILEAGE
            </div>

            <div className="vehicle-stat-value">
              {vehicles.length
                ? `${Math.round(vehicles.reduce((total, vehicle) => total + (vehicle.mileage || 0), 0) / vehicles.length).toLocaleString("en-IN")} km`
                : "0 km"}
            </div>
          </div>

        </section>


        {/* =========================
            FILTERS
        ========================= */}

        <div className="vehicle-filter-area">

          <input
            type="text"
            className="vehicle-search"
            placeholder="Search by reg, owner, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />


        </div>


        {/* =========================
            VEHICLE TABLE
        ========================= */}

        <div className="vehicles-table-panel">

          <div className="vehicles-table-wrapper">

            <table className="vehicles-table">

              <thead>
                <tr>
                  <th>REG. NO.</th>
                  <th>MAKE &amp; MODEL</th>
                  <th>YEAR</th>
                  <th>OWNER</th>
                  <th>MILEAGE</th>
                  <th>INSURANCE EXPIRY</th>
                  <th>WARRANTY EXPIRY</th>
                </tr>
              </thead>


              <tbody>

                {loading && <tr><td colSpan="7">Loading vehicles…</td></tr>}
                {!loading && error && <tr><td colSpan="7" role="alert">{error}</td></tr>}
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>

                    <td className="vehicle-registration">
                      {vehicle.registrationNo}
                    </td>


                    <td className="vehicle-model">

                      <strong>
                        {vehicle.model}
                      </strong>

                      <span>
                        {vehicle.make}
                      </span>

                    </td>


                    <td className="vehicle-year">
                      {vehicle.year}
                    </td>


                    <td className="vehicle-owner">
                      {vehicle.customerName || "—"}
                    </td>


                    <td className="vehicle-mileage">
                      {vehicle.mileage == null ? "—" : `${Number(vehicle.mileage).toLocaleString("en-IN")} km`}
                    </td>


                    <td
                      className="vehicle-insurance"
                    >
                      {vehicle.insuranceExpiry || "—"}
                    </td>

                    <td>
                      {vehicle.warrantyExpiry || "—"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>


            {!loading && !error && filteredVehicles.length === 0 && (
              <div className="no-vehicles">
                No vehicles found.
              </div>
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          REGISTER VEHICLE MODAL
      ===================================================== */}

      {showRegisterModal && (
        <div
          className="vehicle-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowRegisterModal(false);
            }
          }}
        >

          <div className="vehicle-modal">

            {/* MODAL HEADER */}

            <div className="vehicle-modal-header">

              <h2>
                REGISTER VEHICLE
              </h2>

              <button
                type="button"
                className="vehicle-modal-close"
                onClick={() => setShowRegisterModal(false)}
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* MODAL BODY */}

            <form
              className="vehicle-modal-form"
              onSubmit={handleRegisterVehicle}
            >

              {/* REGISTRATION NUMBER */}

              <div className="vehicle-form-group full">
                <label>
                  REGISTRATION NUMBER
                </label>

                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="MH-XX-YY-0000"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                />
              </div>


              {/* MAKE + MODEL */}

              <div className="vehicle-form-grid">

                <div className="vehicle-form-group">
                  <label>
                    MAKE / BRAND
                  </label>

                  <select
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                  >
                    <option>Maruti Suzuki</option>
                    <option>Hyundai</option>
                    <option>Toyota</option>
                    <option>Honda</option>
                    <option>Volkswagen</option>
                    <option>Tata</option>
                    <option>Mahindra</option>
                    <option>Kia</option>
                  </select>
                </div>


                <div className="vehicle-form-group">
                  <label>
                    MODEL
                  </label>

                  <input
                    type="text"
                    name="model"
                    placeholder="Swift VXI"
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>

              </div>


              {/* YEAR */}

              <div className="vehicle-form-group full">

                <label>
                  YEAR
                </label>

                <input
                  type="number"
                  name="year"
                  placeholder="2022"
                  value={formData.year}
                  onChange={handleInputChange}
                />

              </div>


              {/* CUSTOMER */}

              <div className="vehicle-form-group full">

                <label>
                  CUSTOMER / OWNER
                </label>

                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select customer...
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>

              </div>


              {/* MILEAGE + ENGINE */}

              <div className="vehicle-form-grid">

                <div className="vehicle-form-group">
                  <label>
                    CURRENT MILEAGE (KM)
                  </label>

                  <input
                    type="number"
                    name="mileage"
                    placeholder="0"
                    value={formData.mileage}
                    onChange={handleInputChange}
                  />
                </div>


                <div className="vehicle-form-group">
                  <label>
                    ENGINE NO.
                  </label>

                  <input
                    type="text"
                    name="engineNo"
                    placeholder="Optional"
                    value={formData.engineNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="vehicle-form-group">
                  <label>CHASSIS NO.</label>
                  <input
                    type="text"
                    name="chassisNo"
                    placeholder="Optional"
                    value={formData.chassisNo}
                    onChange={handleInputChange}
                  />
                </div>

              </div>


              {/* INSURANCE */}

              <div className="vehicle-form-group full">

                <label>
                  INSURANCE EXPIRY
                </label>

                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleInputChange}
                />

              </div>


              {/* WARRANTY */}

              <div className="vehicle-form-group full">

                <label>
                  WARRANTY EXPIRY
                </label>

                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleInputChange}
                />

              </div>


              {/* BUTTONS */}

              <div className="vehicle-modal-footer">

                <button
                  type="submit"
                  className="vehicle-register-submit"
                  disabled={saving}
                >
                  {saving ? "SAVING..." : "REGISTER VEHICLE"}
                </button>

                <button
                  type="button"
                  className="vehicle-register-cancel"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  );
}

export default GarageOwnerVehicles;