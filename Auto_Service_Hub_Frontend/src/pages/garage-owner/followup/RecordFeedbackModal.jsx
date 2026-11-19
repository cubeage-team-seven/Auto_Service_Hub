import React, { useEffect, useMemo, useState } from "react";

function RecordFeedbackModal({ open, customers, jobCards, onClose, onSave }) {
  const [form, setForm] = useState({ customerId: "", jobCardId: "", rating: "", comments: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const availableJobs = useMemo(
    () => jobCards.filter((job) =>
      String(job.customerId) === form.customerId && job.status === "DELIVERED"),
    [jobCards, form.customerId]
  );

  useEffect(() => {
    if (open) {
      setForm({ customerId: "", jobCardId: "", rating: "", comments: "" });
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.customerId || !form.jobCardId || !form.rating) {
      setError("Select the customer, a delivered job card, and a rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        customerId: Number(form.customerId),
        jobCardId: Number(form.jobCardId),
        rating: Number(form.rating),
        comments: form.comments.trim(),
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save feedback.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="followup-modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="followup-modal">
        <div className="followup-modal-header">
          <h2>RECORD CUSTOMER FEEDBACK</h2>
          <button type="button" className="followup-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="followup-modal-form" onSubmit={submit}>
          <div className="followup-form-scroll">
            <p className="followup-form-note">Feedback is linked to a delivered job card and saved to the workshop records.</p>
            {error && <div className="followup-feedback followup-feedback-error" role="alert">{error}</div>}
            <div className="followup-form-group">
              <label htmlFor="feedback-customer">CUSTOMER</label>
              <select id="feedback-customer" value={form.customerId}
                onChange={(event) => setForm((value) => ({ ...value, customerId: event.target.value, jobCardId: "" }))}>
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </div>
            <div className="followup-form-group">
              <label htmlFor="feedback-job-card">DELIVERED JOB CARD</label>
              <select id="feedback-job-card" value={form.jobCardId}
                disabled={!form.customerId}
                onChange={(event) => setForm((value) => ({ ...value, jobCardId: event.target.value }))}>
                <option value="">Select delivered job card</option>
                {availableJobs.map((job) => <option key={job.id} value={job.id}>{job.jobCardNumber} — {job.serviceType}</option>)}
              </select>
            </div>
            <div className="followup-form-group">
              <label htmlFor="feedback-rating">RATING</label>
              <select id="feedback-rating" value={form.rating}
                onChange={(event) => setForm((value) => ({ ...value, rating: event.target.value }))}>
                <option value="">Select rating</option>
                {[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} / 5</option>)}
              </select>
            </div>
            <div className="followup-form-group">
              <label htmlFor="feedback-comments">COMMENTS</label>
              <textarea id="feedback-comments" rows="4" maxLength={2000} value={form.comments}
                onChange={(event) => setForm((value) => ({ ...value, comments: event.target.value }))} />
            </div>
          </div>
          <div className="followup-modal-divider" />
          <div className="followup-modal-actions">
            <button type="submit" className="followup-save-button" disabled={saving}>
              {saving ? "SAVING..." : "SAVE FEEDBACK"}
            </button>
            <button type="button" className="followup-cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordFeedbackModal;
