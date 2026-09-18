import React, { useState } from "react";
import "./GarageOwnerAppointments.css";

function GarageOwnerAppointments() {
  const [selectedDay, setSelectedDay] = useState("ALL DAYS");
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      id: "APT-0881",
      date: "17 Aug 2026",
      time: "09:00 AM",
      customer: "Vikram Singh",
      vehicle: "Fortuner UP-32-GH-1190",
      service: "Suspension & Tyres",
      type: "Walk-in",
      bay: "Bay 3",
      pickup: "—",
      advisor: "Ramesh K.",
      status: "Confirmed",
      statusClass: "confirmed",
      day: "17 AUG",
    },
    {
      id: "APT-0882",
      date: "17 Aug 2026",
      time: "10:30 AM",
      customer: "Anjali Tiwari",
      vehicle: "Verna MH-04-RT-6621",
      service: "Full Service",
      type: "Online",
      bay: "Bay 1",
      pickup: "✓",
      advisor: "Ramesh K.",
      status: "Confirmed",
      statusClass: "confirmed",
      day: "17 AUG",
    },
    {
      id: "APT-0883",
      date: "17 Aug 2026",
      time: "12:00 PM",
      customer: "Karan Malhotra",
      vehicle: "Nexon TN-09-HH-2210",
      service: "AC Service",
      type: "Online",
      bay: "Bay 2",
      pickup: "—",
      advisor: "Sunita P.",
      status: "In Progress",
      statusClass: "progress",
      day: "17 AUG",
    },
    {
      id: "APT-0884",
      date: "17 Aug 2026",
      time: "02:00 PM",
      customer: "Sonal Gupta",
      vehicle: "WagonR GJ-01-AB-5541",
      service: "Basic Service",
      type: "Walk-in",
      bay: "Bay 4",
      pickup: "—",
      advisor: "Ramesh K.",
      status: "Pending",
      statusClass: "pending",
      day: "17 AUG",
    },
    {
      id: "APT-0885",
      date: "18 Aug 2026",
      time: "09:30 AM",
      customer: "Arjun Mehta",
      vehicle: "Swift MH-12-AB-4521",
      service: "Battery Replacement",
      type: "Online",
      bay: "Bay 1",
      pickup: "—",
      advisor: "Sunita P.",
      status: "Confirmed",
      statusClass: "confirmed",
      day: "18 AUG",
    },
    {
      id: "APT-0886",
      date: "18 Aug 2026",
      time: "11:00 AM",
      customer: "Priya Sharma",
      vehicle: "Creta DL-01-CZ-9834",
      service: "Tyre Rotation",
      type: "Online",
      bay: "Bay 2",
      pickup: "—",
      advisor: "Ramesh K.",
      status: "Confirmed",
      statusClass: "confirmed",
      day: "18 AUG",
    },
    {
      id: "APT-0887",
      date: "19 Aug 2026",
      time: "10:00 AM",
      customer: "Neha Joshi",
      vehicle: "City MH-14-PQ-3356",
      service: "Denting & Painting",
      type: "Pickup/Drop",
      bay: "Bay 3",
      pickup: "✓",
      advisor: "Sunita P.",
      status: "Pending",
      statusClass: "pending",
      day: "19 AUG",
    },
  ]);

  const [appointmentForm, setAppointmentForm] = useState({
    type: "Walk-in",
    customer: "",
    vehicle: "",
    service: "Basic Service",
    date: "",
    time: "09:00 AM",
    bay: "Bay 1",
    advisor: "Ramesh K.",
    pickupDrop: false,
    notes: "",
  });

  const filteredAppointments =
    selectedDay === "ALL DAYS"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.day === selectedDay
        );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAppointmentForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();

    if (
      !appointmentForm.customer ||
      !appointmentForm.vehicle ||
      !appointmentForm.date
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const selectedDate = new Date(
      `${appointmentForm.date}T00:00:00`
    );

    const dayNumber = selectedDate
      .getDate()
      .toString()
      .padStart(2, "0");

    const monthName = selectedDate.toLocaleString("en-US", {
      month: "short",
    });

    const year = selectedDate.getFullYear();

    const day = `${dayNumber} ${monthName.toUpperCase()}`;

    const formattedDate = `${dayNumber} ${monthName} ${year}`;

    const newIdNumber =
      881 +
      appointments.length +
      1;

    const newAppointment = {
      id: `APT-${newIdNumber}`,
      date: formattedDate,
      time: appointmentForm.time,
      customer: appointmentForm.customer,
      vehicle: appointmentForm.vehicle,
      service: appointmentForm.service,
      type: appointmentForm.type,
      bay: appointmentForm.bay,
      pickup: appointmentForm.pickupDrop ? "✓" : "—",
      advisor: appointmentForm.advisor,
      status: "Pending",
      statusClass: "pending",
      day: day,
    };

    setAppointments((previous) => [
      ...previous,
      newAppointment,
    ]);

    setSelectedDay("ALL DAYS");
    setShowNewAppointment(false);

    setAppointmentForm({
      type: "Walk-in",
      customer: "",
      vehicle: "",
      service: "Basic Service",
      date: "",
      time: "09:00 AM",
      bay: "Bay 1",
      advisor: "Ramesh K.",
      pickupDrop: false,
      notes: "",
    });
  };

  const handleEdit = (appointment) => {
    alert(`Edit appointment ${appointment.id}`);
  };

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
            4
          </div>

          <div className="appointment-stat-description">
            2 confirmed · 1 pending
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            TOMORROW
          </div>

          <div className="appointment-stat-value lime">
            2
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            THIS WEEK
          </div>

          <div className="appointment-stat-value">
            12
          </div>

        </div>


        <div className="appointment-stat-card">

          <div className="appointment-stat-label">
            PICKUP/DROP
          </div>

          <div className="appointment-stat-value">
            3
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


        <button
          type="button"
          className={
            selectedDay === "17 AUG"
              ? "day-filter active"
              : "day-filter"
          }
          onClick={() => setSelectedDay("17 AUG")}
        >
          17 AUG
        </button>


        <button
          type="button"
          className={
            selectedDay === "18 AUG"
              ? "day-filter active"
              : "day-filter"
          }
          onClick={() => setSelectedDay("18 AUG")}
        >
          18 AUG
        </button>


        <button
          type="button"
          className={
            selectedDay === "19 AUG"
              ? "day-filter active"
              : "day-filter"
          }
          onClick={() => setSelectedDay("19 AUG")}
        >
          19 AUG
        </button>

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
                <th>TYPE</th>
                <th>BAY</th>
                <th>PICKUP</th>
                <th>ADVISOR</th>
                <th>STATUS</th>
                <th></th>
              </tr>

            </thead>


            <tbody>

              {filteredAppointments.map((appointment) => (

                <tr key={appointment.id}>

                  <td className="appointment-id">
                    {appointment.id}
                  </td>


                  <td className="appointment-date">

                    <strong>
                      {appointment.date}
                    </strong>

                    <span>
                      {appointment.time}
                    </span>

                  </td>


                  <td className="appointment-customer">
                    {appointment.customer}
                  </td>


                  <td className="appointment-vehicle">
                    {appointment.vehicle}
                  </td>


                  <td className="appointment-service">
                    {appointment.service}
                  </td>


                  <td className="appointment-type">
                    {appointment.type}
                  </td>


                  <td className="appointment-bay">
                    {appointment.bay}
                  </td>


                  <td
                    className={
                      appointment.pickup === "✓"
                        ? "appointment-pickup yes"
                        : "appointment-pickup"
                    }
                  >
                    {appointment.pickup}
                  </td>


                  <td className="appointment-advisor">
                    {appointment.advisor}
                  </td>


                  <td>

                    <span
                      className={`appointment-status ${appointment.statusClass}`}
                    >
                      {appointment.status}
                    </span>

                  </td>


                  <td>

                    <button
                      type="button"
                      className="appointment-edit-button"
                      onClick={() =>
                        handleEdit(appointment)
                      }
                    >
                      Edit
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {filteredAppointments.length === 0 && (

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


                {/* APPOINTMENT TYPE */}

                <div className="appointment-form-group">

                  <label>
                    APPOINTMENT TYPE
                  </label>

                  <div className="appointment-type-options">

                    <label className="appointment-radio-option">

                      <input
                        type="radio"
                        name="type"
                        value="Walk-in"
                        checked={
                          appointmentForm.type ===
                          "Walk-in"
                        }
                        onChange={handleInputChange}
                      />

                      <span>
                        Walk-in
                      </span>

                    </label>


                    <label className="appointment-radio-option">

                      <input
                        type="radio"
                        name="type"
                        value="Online"
                        checked={
                          appointmentForm.type ===
                          "Online"
                        }
                        onChange={handleInputChange}
                      />

                      <span>
                        Online
                      </span>

                    </label>


                    <label className="appointment-radio-option">

                      <input
                        type="radio"
                        name="type"
                        value="Pickup/Drop"
                        checked={
                          appointmentForm.type ===
                          "Pickup/Drop"
                        }
                        onChange={handleInputChange}
                      />

                      <span>
                        Pickup/Drop
                      </span>

                    </label>

                  </div>

                </div>


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

                    <option value="Vikram Singh">
                      Vikram Singh
                    </option>

                    <option value="Anjali Tiwari">
                      Anjali Tiwari
                    </option>

                    <option value="Karan Malhotra">
                      Karan Malhotra
                    </option>

                    <option value="Sonal Gupta">
                      Sonal Gupta
                    </option>

                    <option value="Arjun Mehta">
                      Arjun Mehta
                    </option>

                    <option value="Priya Sharma">
                      Priya Sharma
                    </option>

                    <option value="Neha Joshi">
                      Neha Joshi
                    </option>

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

                    <option value="Fortuner UP-32-GH-1190">
                      Fortuner UP-32-GH-1190
                    </option>

                    <option value="Verna MH-04-RT-6621">
                      Verna MH-04-RT-6621
                    </option>

                    <option value="Nexon TN-09-HH-2210">
                      Nexon TN-09-HH-2210
                    </option>

                    <option value="WagonR GJ-01-AB-5541">
                      WagonR GJ-01-AB-5541
                    </option>

                    <option value="Swift MH-12-AB-4521">
                      Swift MH-12-AB-4521
                    </option>

                    <option value="Creta DL-01-CZ-9834">
                      Creta DL-01-CZ-9834
                    </option>

                    <option value="City MH-14-PQ-3356">
                      City MH-14-PQ-3356
                    </option>

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

                    <select
                      name="time"
                      value={appointmentForm.time}
                      onChange={handleInputChange}
                    >

                      <option>
                        09:00 AM
                      </option>

                      <option>
                        10:30 AM
                      </option>

                      <option>
                        12:00 PM
                      </option>

                      <option>
                        02:00 PM
                      </option>

                      <option>
                        03:30 PM
                      </option>

                      <option>
                        05:00 PM
                      </option>

                    </select>

                  </div>

                </div>


                {/* BAY + ADVISOR */}

                <div className="appointment-form-row">

                  <div className="appointment-form-group">

                    <label>
                      BAY / SLOT
                    </label>

                    <select
                      name="bay"
                      value={appointmentForm.bay}
                      onChange={handleInputChange}
                    >

                      <option>
                        Bay 1
                      </option>

                      <option>
                        Bay 2
                      </option>

                      <option>
                        Bay 3
                      </option>

                      <option>
                        Bay 4
                      </option>

                    </select>

                  </div>


                  <div className="appointment-form-group">

                    <label>
                      ASSIGNED ADVISOR
                    </label>

                    <select
                      name="advisor"
                      value={appointmentForm.advisor}
                      onChange={handleInputChange}
                    >

                      <option>
                        Ramesh K.
                      </option>

                      <option>
                        Sunita P.
                      </option>

                    </select>

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
                >
                  BOOK APPOINTMENT
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