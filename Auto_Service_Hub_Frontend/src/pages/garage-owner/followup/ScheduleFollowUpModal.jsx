import React, { useEffect, useMemo, useState } from "react";

import { describeDueDate } from "./followUpUtils";

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const TYPES = ["Service Reminder", "Post-Service Check", "Insurance Renewal", "Annual Maintenance", "Payment Reminder", "Tyre & Battery Check", "Feedback Request"];
const CHANNELS = [
  ["PHONE_CALL", "Phone Call"],
  ["WHATSAPP", "WhatsApp"],
  ["SMS", "SMS"],
  ["EMAIL", "Email"],
  ["IN_PERSON", "In Person"],
];

/* =========================================================
   EMPTY FORM
   ========================================================= */

const emptyForm = () => {
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
  const dueDate = `${nextHour.getFullYear()}-${String(nextHour.getMonth() + 1).padStart(2, "0")}-${String(nextHour.getDate()).padStart(2, "0")}`;
  return {
    customerId: "",
    vehicleId: "",
    jobCardId: "",
    type: TYPES[0],
    dueDate,
    dueTime: `${String(nextHour.getHours()).padStart(2, "0")}:00`,
    channel: CHANNELS[0][0],
    assignedUserId: "",
    reason: "",
  };
};

/* Schedule and update a follow-up using persisted customer records. */

function ScheduleFollowUpModal({ open, customers, vehicles, jobCards, assignees, initialFollowup, onClose, onSave, optionsLoading }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* Reopening the modal always starts from a clean form. */
  useEffect(() => {
    if (open) {
      setForm(initialFollowup ? {
        ...emptyForm(),
        customerId: String(initialFollowup.customerId || ""),
        vehicleId: initialFollowup.vehicleId ? String(initialFollowup.vehicleId) : "",
        jobCardId: initialFollowup.jobCardId ? String(initialFollowup.jobCardId) : "",
        type: initialFollowup.type || TYPES[0],
        dueDate: initialFollowup.dueDate || todayKey(),
        dueTime: initialFollowup.reminderAt?.slice(11, 16) || "09:00",
        channel: initialFollowup.backendChannel || CHANNELS[0][0],
        assignedUserId: initialFollowup.assignedUserId ? String(initialFollowup.assignedUserId) : "",
        reason: initialFollowup.reason || "",
      } : emptyForm());
      setErrors({});
      setSaveError("");
      setSubmitting(false);
    }
  }, [open, initialFollowup]);

  const vehiclesForCustomer = useMemo(() => {
    return vehicles.filter((vehicle) => String(vehicle.customerId) === form.customerId);
  }, [vehicles, form.customerId]);

  const jobCardsForCustomer = useMemo(
    () => jobCards.filter((job) => String(job.customerId) === form.customerId),
    [jobCards, form.customerId]
  );

  const dueNote = useMemo(
    () => describeDueDate(form.dueDate, todayKey()),
    [form.dueDate]
  );

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSaveError("");
    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }
      const next = { ...previous };
      delete next[name];
      return next;
    });

    setForm((previous) => {
      if (name === "customerId") {
        return { ...previous, customerId: value, vehicleId: "", jobCardId: "" };
      }
      return { ...previous, [name]: value };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.customerId) {
      nextErrors.customer = "Select the customer this follow-up belongs to.";
    }
    if (vehiclesForCustomer.length > 0 && !form.vehicleId) {
      nextErrors.vehicle = "Select the customer's vehicle.";
    }

    if (!form.dueDate) {
      nextErrors.dueDate = "Choose the date the follow-up is due.";
    } else if (!form.dueTime) {
      nextErrors.dueDate = "Choose the reminder time.";
    } else {
      const selectedReminder = `${form.dueDate}T${form.dueTime}`;
      const originalReminder = initialFollowup?.reminderAt?.slice(0, 16);
      if (new Date(selectedReminder).getTime() < Date.now()
          && (!initialFollowup || selectedReminder !== originalReminder)) {
        nextErrors.dueDate = "The reminder cannot be scheduled in the past.";
      }
    }

    if (!form.type) {
      nextErrors.type = "Choose the follow-up type.";
    }

    if (!form.channel) {
      nextErrors.channel = "Choose the communication channel.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSaveError("Complete the highlighted fields before saving.");
      return;
    }

    try {
      setSubmitting(true);
      const message = await onSave({
        ...form,
        customerId: Number(form.customerId),
        vehicleId: form.vehicleId ? Number(form.vehicleId) : null,
        jobCardId: form.jobCardId ? Number(form.jobCardId) : null,
        assignedUserId: form.assignedUserId ? Number(form.assignedUserId) : null,
      });
      if (message) setSaveError(message);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save follow-up.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="followup-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="followup-modal">

        <div className="followup-modal-header">
          <h2>{initialFollowup ? "UPDATE FOLLOW-UP" : "SCHEDULE FOLLOW-UP"}</h2>

          <button
            type="button"
            className="followup-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="followup-modal-form" onSubmit={handleSubmit}>

          <div className="followup-form-scroll">

            <p className="followup-form-note">Schedule a customer follow-up and persistent reminder.</p>

            {saveError && (
              <div
                className="followup-feedback followup-feedback-error"
                role="alert"
              >
                {saveError}
              </div>
            )}

            <div className="followup-form-row">

              <div className="followup-form-group">
                <label htmlFor="followup-customer">CUSTOMER</label>

                <select
                  id="followup-customer"
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                >
                  <option value="">Select customer</option>

                  {customers.map((entry) => (
                    <option value={entry.id} key={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                </select>

                {errors.customer && (
                  <span className="followup-field-error">
                    {errors.customer}
                  </span>
                )}
              </div>

              <div className="followup-form-group">
                <label htmlFor="followup-vehicle">
                  VEHICLE / REGISTRATION
                </label>

                <select
                  id="followup-vehicle"
                  name="vehicleId"
                  value={form.vehicleId}
                  onChange={handleChange}
                  disabled={!form.customerId || vehiclesForCustomer.length === 0}
                >
                  <option value="">
                    {form.customerId ? "Select vehicle (optional)" : "Select customer first"}
                  </option>

                  {vehiclesForCustomer.map((entry) => (
                    <option value={entry.id} key={entry.id}>
                      {entry.make} {entry.model} — {entry.registrationNo}
                    </option>
                  ))}
                </select>

                {errors.vehicle && (
                  <span className="followup-field-error">{errors.vehicle}</span>
                )}
              </div>

            </div>


            <div className="followup-form-row">

              <div className="followup-form-group">
                <label htmlFor="followup-type">FOLLOW-UP TYPE</label>

                <select
                  id="followup-type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  {TYPES.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {errors.type && (
                  <span className="followup-field-error">{errors.type}</span>
                )}
              </div>

              <div className="followup-form-group">
                <label htmlFor="followup-due-date">FOLLOW-UP DATE</label>

                <input
                  id="followup-due-date"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  min={todayKey()}
                  onChange={handleChange}
                />

                {errors.dueDate ? (
                  <span className="followup-field-error">{errors.dueDate}</span>
                ) : (
                  <span className={`followup-field-hint ${dueNote.tone}`}>
                    {dueNote.label}
                  </span>
                )}
              </div>

              <div className="followup-form-row">
                <div className="followup-form-group">
                  <label htmlFor="followup-due-time">REMINDER TIME</label>
                  <input
                    id="followup-due-time"
                    type="time"
                    name="dueTime"
                    value={form.dueTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="followup-form-group">
                  <label htmlFor="followup-job-card">RELATED JOB CARD</label>
                  <select
                    id="followup-job-card"
                    name="jobCardId"
                    value={form.jobCardId}
                    onChange={handleChange}
                    disabled={!form.customerId}
                  >
                    <option value="">No job card</option>
                    {jobCardsForCustomer.map((job) => (
                      <option value={job.id} key={job.id}>
                        {job.jobCardNumber} — {job.serviceType || job.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>


            <div className="followup-form-row">

              <div className="followup-form-group">
                <label htmlFor="followup-channel">CHANNEL</label>

                <select
                  id="followup-channel"
                  name="channel"
                  value={form.channel}
                  onChange={handleChange}
                >
                  {CHANNELS.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {errors.channel && (
                  <span className="followup-field-error">{errors.channel}</span>
                )}
              </div>

              <div className="followup-form-group">
                <label htmlFor="followup-assigned">ASSIGNED TO</label>

                <select
                  id="followup-assigned"
                  name="assignedUserId"
                  value={form.assignedUserId}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {assignees.map((staff) => (
                    <option value={staff.id} key={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>


            <div className="followup-form-group">
              <label htmlFor="followup-notes">FOLLOW-UP DETAILS</label>

              <textarea
                id="followup-notes"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                maxLength={500}
                rows="3"
                placeholder="What should the reminder cover?"
              />

              <span className="followup-field-hint">
                {form.reason.length} / 500 characters
              </span>
            </div>

          </div>

          <div className="followup-modal-divider"></div>

          <div className="followup-modal-actions">

            <button type="submit" className="followup-save-button" disabled={optionsLoading || submitting}>
              {optionsLoading ? "LOADING OPTIONS..." : submitting ? "SAVING..." : initialFollowup ? "UPDATE FOLLOW-UP" : "SAVE FOLLOW-UP"}
            </button>

            <button
              type="button"
              className="followup-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ScheduleFollowUpModal;
