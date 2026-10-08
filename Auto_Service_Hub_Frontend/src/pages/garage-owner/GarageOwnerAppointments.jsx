import React, { useEffect, useState } from "react";
import { appointmentsApi, customersApi, vehiclesApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerAppointments.css";

const dateKey = (value) => {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

function GarageOwnerAppointments() {
  const [selectedDay, setSelectedDay] = useState("ALL DAYS");
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [appointmentForm, setAppointmentForm] = useState({
    customer: "",
    vehicle: "",
    service: "Basic Service",
    date: "",
    time: "09:00",
    pickupDrop: false,
    notes: "",
  });

  useEffect(() => {
    Promise.all([appointmentsApi.list(), customersApi.list(), vehiclesApi.list()])
      .then(([appointmentRecords, customerRecords, vehicleRecords]) => {
        setAppointments(appointmentRecords);
        setCustomers(customerRecords);
        setVehicles(vehicleRecords);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filteredAppointments =
    selectedDay === "ALL DAYS"
      ? appointments
      : appointments.filter(
          (appointment) => dateKey(appointment.appointmentAt) === selectedDay
        );
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const todayKey = dateKey(today);
  const tomorrowKey = dateKey(tomorrow);
  const dayKeys = [...new Set(appointments.map((appointment) => dateKey(appointment.appointmentAt)))].sort();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAppointmentForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "customer" ? { vehicle: "" } : {}),
    }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (
      !appointmentForm.customer ||
      !appointmentForm.vehicle ||
      !appointmentForm.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const created = await appointmentsApi.create({
        customerId: Number(appointmentForm.customer),
        vehicleId: Number(appointmentForm.vehicle),
        serviceType: appointmentForm.service,
        appointmentAt: `${appointmentForm.date}T${appointmentForm.time}:00`,
        pickupDrop: appointmentForm.pickupDrop,
        notes: appointmentForm.notes,
        status: "PENDING",
      });
      setAppointments((existing) => [created, ...existing]);
      setSelectedDay("ALL DAYS");
      setShowNewAppointment(false);
      setAppointmentForm({
        customer: "",
        vehicle: "",
        service: "Basic Service",
        date: "",
        time: "09:00",
        pickupDrop: false,
        notes: "",
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not book appointment."));
    } finally {
      setSaving(false);
    }
  };

  const formatAppointmentDate = (value) => value
    ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : "—";

  return (
    <div className="garage-appointments-content">

      {/* ================= HEADING ================= */}

      <div className="appointments-heading-row">

        <h1>APPOINTMENTS</h1>

        <button
          type="button"
          className="new-appointment-button"
          onClick={() => setShowNewAppointment(true)}
        >
          + NEW APPOINTMENT
        </button>

      </div>


      {/* ================= STAT CARDS ================= */}

      <section className="appointment-stats">

        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            TODAY
          </div>

          <div className="appointment-stat-value">
            {appointments.filter((appointment) => dateKey(appointment.appointmentAt) === todayKey).length}
          </div>

          <div className="appointment-stat-description">
            {appointments.filter((appointment) => dateKey(appointment.appointmentAt) === todayKey && appointment.status === "CONFIRMED").length} confirmed · {appointments.filter((appointment) => dateKey(appointment.appointmentAt) === todayKey && appointment.status === "PENDING").length} pending
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            TOMORROW
          </div>

          <div className="appointment-stat-value lime">
            {appointments.filter((appointment) => dateKey(appointment.appointmentAt) === tomorrowKey).length}
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            THIS WEEK
          </div>

          <div className="appointment-stat-value">
            {appointments.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentAt);
              return appointmentDate >= today && appointmentDate < weekEnd;
            }).length}
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            PICKUP/DROP
          </div>

          <div className="appointment-stat-value">
            {appointments.filter((appointment) => appointment.pickupDrop).length}
          </div>

          <div className="appointment-stat-description">
            requiring logistics
          </div>

        </div>

      </section>


      {/* ================= DAY FILTER ================= */}

      <div className="appointment-day-filters">

        <button
          type="button"
          className={
            selectedDay === "ALL DAYS"
              ? "day-filter active"
              : "day-filter"
          }
          onClick={() => setSelectedDay("ALL DAYS")}
        >
          ALL DAYS
        </button>


        {dayKeys.map((day) => (
          <button
            key={day}
            type="button"
            className={selectedDay === day ? "day-filter active" : "day-filter"}
            onClick={() => setSelectedDay(day)}
          >
            {new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }).toUpperCase()}
          </button>
        ))}

      </div>


      {/* ================= APPOINTMENT TABLE ================= */}

      <div className="appointments-table-panel">

        <div className="appointments-table-wrapper">

          <table className="appointments-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>DATE &amp; TIME</th>
                <th>CUSTOMER</th>
                <th>VEHICLE</th>
                <th>SERVICE</th>
                <th>PICKUP</th>
                <th>STATUS</th>
              </tr>

            </thead>


            <tbody>

              {loading && <tr><td colSpan="7">Loading appointments…</td></tr>}
              {!loading && error && <tr><td colSpan="7" role="alert">{error}</td></tr>}
              {filteredAppointments.map((appointment) => (

                <tr key={appointment.id}>

                  <td className="appointment-id">
                    {appointment.id}
                  </td>


                  <td className="appointment-date">

                    {formatAppointmentDate(appointment.appointmentAt)}

                  </td>


                  <td className="appointment-customer">
                    {appointment.customerName}
                  </td>


                  <td className="appointment-vehicle">
                    {appointment.vehicleInfo}
                  </td>


                  <td className="appointment-service">
                    {appointment.serviceType}
                  </td>


                  <td
                    className={
                      appointment.pickupDrop
                        ? "appointment-pickup yes"
                        : "appointment-pickup"
                    }
                  >
                    {appointment.pickupDrop ? "Yes" : "No"}
                  </td>


                  <td>

                    <span
                      className={`appointment-status ${String(appointment.status || "").toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>

                  </td>


                </tr>

              ))}

            </tbody>

          </table>


          {!loading && !error && filteredAppointments.length === 0 && (

            <div className="no-appointments">
              No appointments found.
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          NEW APPOINTMENT MODAL
      ===================================================== */}

      {showNewAppointment && (

        <div
          className="new-appointment-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewAppointment(false);
            }
          }}
        >

          <div className="new-appointment-modal">

            {/* ================= MODAL HEADER ================= */}

            <div className="new-appointment-modal-header">

              <div>
                <div className="new-appointment-label">
                  APPOINTMENT
                </div>

                <h2>
                  NEW APPOINTMENT
                </h2>
              </div>

              <button
                type="button"
                className="new-appointment-close"
                onClick={() =>
                  setShowNewAppointment(false)
                }
              >
                ×
              </button>

            </div>


            {/* ================= FORM ================= */}

            <form
              className="new-appointment-form"
              onSubmit={handleBookAppointment}
            >

              <div className="new-appointment-form-scroll">


                {/* CUSTOMER */}

                <div className="appointment-form-group">

                  <label>
                    CUSTOMER
                  </label>

                  <select
                    name="customer"
                    value={appointmentForm.customer}
                    onChange={handleInputChange}
                    required
                  >

                    <option value="">
                      Select customer...
                    </option>

                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>{customer.name} — {customer.phone}</option>
                    ))}

                  </select>

                </div>


                {/* VEHICLE */}

                <div className="appointment-form-group">

                  <label>
                    VEHICLE
                  </label>

                  <select
                    name="vehicle"
                    value={appointmentForm.vehicle}
                    onChange={handleInputChange}
                    required
                  >

                    <option value="">
                      Select vehicle...
                    </option>

                    {vehicles
                      .filter((vehicle) => !appointmentForm.customer || vehicle.customerId === Number(appointmentForm.customer))
                      .map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNo} — {vehicle.make} {vehicle.model}
                        </option>
                      ))}

                  </select>

                </div>


                {/* SERVICE */}

                <div className="appointment-form-group">

                  <label>
                    SERVICE REQUIRED
                  </label>

                  <select
                    name="service"
                    value={appointmentForm.service}
                    onChange={handleInputChange}
                  >

                    <option value="Basic Service">
                      Basic Service
                    </option>

                    <option value="Full Service">
                      Full Service
                    </option>

                    <option value="AC Service">
                      AC Service
                    </option>

                    <option value="Battery Replacement">
                      Battery Replacement
                    </option>

                    <option value="Tyre Rotation">
                      Tyre Rotation
                    </option>

                    <option value="Denting & Painting">
                      Denting &amp; Painting
                    </option>

                    <option value="Suspension & Tyres">
                      Suspension &amp; Tyres
                    </option>

                  </select>

                </div>


                {/* DATE + TIME */}

                <div className="appointment-form-row">

                  <div className="appointment-form-group">

                    <label>
                      DATE
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={appointmentForm.date}
                      onChange={handleInputChange}
                      required
                    />

                  </div>


                  <div className="appointment-form-group">

                    <label>
                      TIME SLOT
                    </label>

                    <input
                      type="time"
                      name="time"
                      value={appointmentForm.time}
                      onChange={handleInputChange}
                      required
                    />

                  </div>

                </div>


                {/* PICKUP / DROP */}

                <div className="appointment-form-group">

                  <label>
                    PICKUP / DROP SERVICE
                  </label>

                  <label className="pickup-checkbox">

                    <input
                      type="checkbox"
                      name="pickupDrop"
                      checked={
                        appointmentForm.pickupDrop
                      }
                      onChange={handleInputChange}
                    />

                    <span>
                      Customer requires pickup/drop
                      service
                    </span>

                  </label>

                </div>


                {/* SPECIAL NOTES */}

                <div className="appointment-form-group">

                  <label>
                    SPECIAL NOTES
                  </label>

                  <textarea
                    name="notes"
                    placeholder="Any specific instructions or complaints..."
                    value={appointmentForm.notes}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>

                </div>

              </div>


              {/* ================= MODAL FOOTER ================= */}

              <div className="new-appointment-modal-footer">

                <button
                  type="submit"
                  className="book-appointment-button"
                  disabled={saving}
                >
                  {saving ? "SAVING..." : "BOOK APPOINTMENT"}
                </button>

                <button
                  type="button"
                  className="cancel-appointment-button"
                  onClick={() =>
                    setShowNewAppointment(false)
                  }
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

export default GarageOwnerAppointments;