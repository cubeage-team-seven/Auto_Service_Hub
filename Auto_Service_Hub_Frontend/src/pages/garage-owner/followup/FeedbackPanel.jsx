import React from "react";
import { formatDisplayDate, toStars } from "./followUpUtils";

function FeedbackPanel({ feedback, averageRatingValue, totalCount, search, onSearchChange, onRecord, loading }) {
  return (
    <section className="followup-section" aria-label="Customer feedback">
      <div className="followup-section-head">
        <div>
          <h2>CUSTOMER FEEDBACK</h2>
          <p>Ratings and comments recorded against completed service visits.</p>
        </div>
        <div className="followup-section-metrics">
          <span><strong>{totalCount}</strong>RECEIVED</span>
          <span><strong>{averageRatingValue.toFixed(1)}</strong>AVG RATING</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search feedback"
            aria-label="Search customer feedback"
          />
          <button type="button" className="followup-action primary" onClick={onRecord}>
            RECORD FEEDBACK
          </button>
        </div>
      </div>
      {loading && feedback.length === 0 ? (
        <p className="followup-empty-note">Loading feedback...</p>
      ) : feedback.length === 0 ? (
        <p className="followup-empty-note">No customer feedback has been recorded.</p>
      ) : (
        <div className="followup-feedback-grid">
          {feedback.map((entry) => (
            <article className="followup-feedback-card" key={entry.id}>
              <header className="followup-feedback-head">
                <div className="followup-feedback-who">
                  <strong>{entry.customerName || "Customer"}</strong>
                  <span>{entry.jobCardNumber || "Service visit"} — {entry.serviceType || ""}</span>
                </div>
                <div className="followup-feedback-rating">
                  <span className="followup-stars" aria-label={`${entry.rating} out of 5 stars`}>
                    {toStars(entry.rating).map((filled, index) => (
                      <i key={index} className={filled ? "filled" : ""}>{filled ? "★" : "☆"}</i>
                    ))}
                  </span>
                  <strong>{entry.rating}.0</strong>
                </div>
              </header>
              <div className="followup-feedback-meta">
                <span>{entry.ratingLabel}</span>
                <span>{formatDisplayDate(entry.createdAt)}</span>
              </div>
              {entry.comments && <p className="followup-feedback-comment">“{entry.comments}”</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeedbackPanel;
