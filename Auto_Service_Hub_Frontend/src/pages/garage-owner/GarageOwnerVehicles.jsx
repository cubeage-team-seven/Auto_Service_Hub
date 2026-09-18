import React, { useMemo, useState } from "react";
import "./GarageOwnerVehicles.css";

function GarageOwnerVehicles() {
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("All Fuel Types");
  const [status, setStatus] = useState("All Statuses");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "Maruti Suzuki",
    model: "",
    year: "2022",
    fuelType: "Petrol",
    customer: "",
    mileage: "0",
    engineChassis: "",
    insuranceExpiry: "",
    warrantyExpiry: "",
    notes: "",
  });

  const vehicles = [
    {
      regNo: "MH-12-AB-4521",
      model: "Swift VXI",
      make: "Maruti Suzuki",
      year: "2021",
      owner: "Arjun Mehta",
      mileage: "28,400 km",
      insurance: "31 Mar 2027",
      lastService: "17 Aug 2026",
      status: "In Service",
      statusClass: "in-service",
      fuel: "Petrol",
    },
    {
      regNo: "DL-01-CZ-9834",
      model: "Creta SX",
      make: "Hyundai",
      year: "2022",
      owner: "Priya Sharma",
      mileage: "42,100 km",
      insurance: "15 Jun 2027",
      lastService: "17 Aug 2026",
      status: "In Service",
      statusClass: "in-service",
      fuel: "Diesel",
    },
    {
      regNo: "GJ-05-XY-7712",
      model: "Innova Crysta",
      make: "Toyota",
      year: "2019",
      owner: "Rohit Desai",
      mileage: "84,200 km",
      insurance: "28 Feb 2027",
      lastService: "16 Aug 2026",
      status: "Delivered",
      statusClass: "delivered",
      fuel: "Diesel",
    },
    {
      regNo: "MH-14-PQ-3356",
      model: "City ZX",
      make: "Honda",
      year: "2020",
      owner: "Neha Joshi",
      mileage: "38,900 km",
      insurance: "10 Sep 2026",
      insuranceWarning: true,
      lastService: "17 Aug 2026",
      status: "In Service",
      statusClass: "in-service",
      fuel: "Petrol",
    },
    {
      regNo: "UP-32-GH-1190",
      model: "Fortuner 4×4",
      make: "Toyota",
      year: "2023",
      owner: "Vikram Singh",
      mileage: "18,700 km",
      insurance: "22 Jan 2028",
      lastService: "15 Aug 2026",
      status: "Waiting",
      statusClass: "waiting",
      fuel: "Diesel",
    },
    {
      regNo: "KA-03-MN-5567",
      model: "Baleno Delta",
      make: "Maruti Suzuki",
      year: "2018",
      owner: "Kavita Rao",
      mileage: "61,000 km",
      insurance: "05 May 2027",
      lastService: "16 Aug 2026",
      status: "Delivered",
      statusClass: "delivered",
      fuel: "Petrol",
    },
    {
      regNo: "MH-09-ZZ-3344",
      model: "Polo TSI",
      make: "Volkswagen",
      year: "2020",
      owner: "Divya Kapoor",
      mileage: "44,800 km",
      insurance: "14 Dec 2026",
      lastService: "10 Aug 2026",
      status: "Delivered",
      statusClass: "delivered",
      fuel: "Petrol",
    },
  ];

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !searchValue ||
        vehicle.regNo.toLowerCase().includes(searchValue) ||
        vehicle.owner.toLowerCase().includes(searchValue) ||
        vehicle.model.toLowerCase().includes(searchValue) ||
        vehicle.make.toLowerCase().includes(searchValue);

      const matchesFuel =
        fuelType === "All Fuel Types" ||
        vehicle.fuel === fuelType;

      const matchesStatus =
        status === "All Statuses" ||
        vehicle.status === status;

      return matchesSearch && matchesFuel && matchesStatus;
    });
  }, [search, fuelType, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegisterVehicle = (e) => {
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

    alert(
      `Vehicle ${formData.registrationNumber} registered successfully.`
    );

    setShowRegisterModal(false);

    setFormData({
      registrationNumber: "",
      make: "Maruti Suzuki",
      model: "",
      year: "2022",
      fuelType: "Petrol",
      customer: "",
      mileage: "0",
      engineChassis: "",
      insuranceExpiry: "",
      warrantyExpiry: "",
      notes: "",
    });
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
              7
            </div>
          </div>


          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              IN SERVICE
            </div>

            <div className="vehicle-stat-value lime">
              3
            </div>
          </div>


          <div className="vehicle-stat-card">
            <div className="vehicle-stat-label">
              INSURANCE EXPIRING
            </div>

            <div className="vehicle-stat-value">
              2
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
              44K km
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


          <select
            className="vehicle-filter"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option>All Fuel Types</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>CNG</option>
            <option>Electric</option>
          </select>


          <select
            className="vehicle-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All Statuses</option>
            <option>In Service</option>
            <option>Delivered</option>
            <option>Waiting</option>
          </select>

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
                  <th>LAST SERVICE</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>


              <tbody>

                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.regNo}>

                    <td className="vehicle-registration">
                      {vehicle.regNo}
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
                      {vehicle.owner}
                    </td>


                    <td className="vehicle-mileage">
                      {vehicle.mileage}
                    </td>


                    <td
                      className={
                        vehicle.insuranceWarning
                          ? "vehicle-insurance warning"
                          : "vehicle-insurance"
                      }
                    >
                      {vehicle.insurance}

                      {vehicle.insuranceWarning && (
                        <span className="warning-icon">
                          ⚠
                        </span>
                      )}
                    </td>


                    <td className="vehicle-last-service">
                      {vehicle.lastService}
                    </td>


                    <td>
                      <span
                        className={`vehicle-status ${vehicle.statusClass}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>


                    <td>
                      <button
                        type="button"
                        className="vehicle-view-button"
                        onClick={() =>
                          alert(
                            `Vehicle details: ${vehicle.regNo}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>


            {filteredVehicles.length === 0 && (
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


              {/* YEAR + FUEL */}

              <div className="vehicle-form-grid">

                <div className="vehicle-form-group">
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


                <div className="vehicle-form-group">
                  <label>
                    FUEL TYPE
                  </label>

                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>

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

                  <option>
                    Divya Kapoor
                  </option>
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
                    ENGINE / CHASSIS NO.
                  </label>

                  <input
                    type="text"
                    name="engineChassis"
                    placeholder="Optional"
                    value={formData.engineChassis}
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


              {/* NOTES */}

              <div className="vehicle-form-group full">

                <label>
                  NOTES
                </label>

                <textarea
                  name="notes"
                  placeholder="Any known issues or special notes..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                />

              </div>


              {/* BUTTONS */}

              <div className="vehicle-modal-footer">

                <button
                  type="submit"
                  className="vehicle-register-submit"
                >
                  REGISTER VEHICLE
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