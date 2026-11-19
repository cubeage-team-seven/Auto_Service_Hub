import React from "react";

/* =========================================================
   FOLLOW-UP SUMMARY CARDS
   Read-only counters from the follow-up dashboard API.
   ========================================================= */

function FollowUpSummaryCards({ summary }) {
  const cards = [
    {
      key: "due",
      label: "DUE FOLLOW-UPS",
      value: summary.dueFollowUps,
      description: "Due today or already overdue",
      accent: true,
    },
    {
      key: "pending",
      label: "PENDING REMINDERS",
      value: summary.pendingReminders,
      description: "Scheduled and not yet resolved",
    },
    {
      key: "feedback",
      label: "FEEDBACK RECEIVED",
      value: summary.feedbackReceived,
      description: summary.averageRatingLabel,
    },
    {
      key: "messages",
      label: "MESSAGES SENT",
      value: summary.messagesSent,
      description: "Provider-confirmed delivery",
    },
  ];

  return (
    <div className="followup-stats">
      {cards.map((card) => (
        <article className="followup-stat-card" key={card.key}>
          <span className="followup-stat-label">{card.label}</span>

          <strong
            className={
              card.accent ? "followup-stat-value lime" : "followup-stat-value"
            }
          >
            {card.value}
          </strong>

          <small className="followup-stat-note">{card.description}</small>
        </article>
      ))}
    </div>
  );
}

export default FollowUpSummaryCards;
