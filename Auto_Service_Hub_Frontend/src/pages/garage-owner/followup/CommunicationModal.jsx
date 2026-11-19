import React, { useEffect, useMemo, useState } from "react";

import {
  communicationStatusClassName,
  describeDueDate,
  formatDisplayDate,
  statusClassName,
} from "./followUpUtils";

const CHANNELS = [
  ["EMAIL", "Email"],
  ["SMS", "SMS"],
  ["WHATSAPP", "WhatsApp"],
  ["CALL", "Phone Call"],
  ["IN_PERSON", "In Person"],
];
const templateForType = (type) =>
  `Hello {customer}, this is a follow-up regarding your {vehicle} ({registration}). Please contact the workshop if you need assistance.`;
/* =========================================================
   MESSAGE TEMPLATE PICKER
   ========================================================= */

const fillTemplate = (template, followUp) =>
  template
    .replaceAll("{customer}", followUp?.customer || "customer")
    .replaceAll("{vehicle}", followUp?.vehicle || "vehicle")
    .replaceAll("{registration}", followUp?.registration || "registration");

/* Communication records are persisted locally; external delivery is unavailable. */

function CommunicationModal({ open, followUp, history, reminders = [], onClose, onSend }) {
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [sending, setSending] = useState(false);

  /* A different follow-up always starts a fresh draft. */
  useEffect(() => {
    if (open && followUp) {
      setChannel(followUp.backendChannel === "PHONE_CALL"
        ? "CALL"
        : followUp.backendChannel || "EMAIL");
      setMessage(fillTemplate(templateForType(followUp.type), followUp));
      setNotice("");
      setNoticeError(false);
      setSending(false);
    }
  }, [open, followUp]);

  const due = useMemo(
    () => (followUp ? describeDueDate(followUp.dueDate) : null),
    [followUp]
  );

  if (!open || !followUp) {
    return null;
  }

  const handleSend = async () => {
    if (!message.trim()) {
      setNotice("Write a message before recording it.");
      setNoticeError(true);
      return;
    }

    try {
      setSending(true);
      await onSend(followUp, { channel, message: message.trim() });
      setNotice("Message saved to communication history. External delivery is not configured.");
      setNoticeError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to record message.");
      setNoticeError(true);
    } finally {
      setSending(false);
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
      <div className="followup-modal followup-modal-wide">

        <div className="followup-modal-header">
          <h2>CUSTOMER COMMUNICATION</h2>

          <button
            type="button"
            className="followup-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="followup-modal-body">

          {/* =============================================
              CUSTOMER SUMMARY
          ============================================= */}

          <div className="followup-comm-summary">

            <div className="followup-comm-identity">
              <strong>{followUp.customer}</strong>
              <span>{followUp.phone}</span>
            </div>

            <div className="followup-comm-detail">
              <span>VEHICLE</span>
              <strong>
                {followUp.vehicle} — {followUp.registration}
              </strong>
            </div>

            <div className="followup-comm-detail">
              <span>FOLLOW-UP</span>
              <strong>{followUp.type}</strong>
            </div>

            <div className="followup-comm-detail">
              <span>DUE</span>
              <strong>
                {formatDisplayDate(followUp.dueDate)}
                {due ? ` · ${due.label}` : ""}
              </strong>
            </div>

            <div className="followup-comm-detail">
              <span>ASSIGNED TO</span>
              <strong>{followUp.assignedTo}</strong>
            </div>

            <div className="followup-comm-detail">
              <span>STATUS</span>
              <strong>
                <span
                  className={`followup-status ${statusClassName(
                    followUp.status
                  )}`}
                >
                  {followUp.status}
                </span>
              </strong>
            </div>

          </div>


          <p className="followup-form-note">
            Messages are stored in the workshop history only. No SMS, email, WhatsApp, or call provider is configured.
          </p>

          {notice && (
            <div
              className={`followup-feedback ${noticeError ? "followup-feedback-error" : "followup-feedback-success"}`}
              role={noticeError ? "alert" : "status"}
            >
              {notice}
            </div>
          )}


          {/* =============================================
              DRAFT MESSAGE
          ============================================= */}

          <div className="followup-form-group">
            <label htmlFor="followup-comm-channel">CHANNEL</label>

            <select
              id="followup-comm-channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
            >
              {CHANNELS.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="followup-form-group">
            <label htmlFor="followup-comm-message">MESSAGE</label>

            <textarea
              id="followup-comm-message"
              value={message}
              rows="5"
              maxLength={1000}
              onChange={(event) => setMessage(event.target.value)}
            />

            <span className="followup-field-hint">
              {message.length} / 1000 characters
            </span>
          </div>

          <div className="followup-comm-actions">

            <button
              type="button"
              className="followup-save-button"
              disabled={sending}
              onClick={handleSend}
            >
              {sending ? "RECORDING..." : "RECORD MESSAGE (NOT SENT)"}
            </button>

            <button
              type="button"
              className="followup-cancel-button"
              onClick={() =>
                setMessage(fillTemplate(templateForType(followUp.type), followUp))
              }
            >
              Reset message
            </button>

          </div>


          {/* =============================================
              COMMUNICATION HISTORY
          ============================================= */}

          <div className="followup-comm-history">

            <h3>
              COMMUNICATION HISTORY
              <span>{history.length} RECORDS</span>
            </h3>

            {history.length === 0 ? (
              <p className="followup-comm-empty">
                No communication has been recorded for this follow-up yet.
              </p>
            ) : (
              <ul className="followup-history-list">
                {history.map((entry) => (
                  <li className="followup-history-row" key={entry.id}>
                    <div className="followup-history-main">
                      <strong>{entry.channel}</strong>
                      <span>{formatDisplayDate(entry.createdAt || entry.at)}</span>
                    </div>
                    <p className="followup-history-note">{entry.message || entry.note}</p>
                    <span
                      className={`followup-comm-status ${communicationStatusClassName(
                        entry.deliveryStatus || entry.status
                      )}`}
                    >
                      {entry.deliveryStatus || entry.status}
                    </span>

                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="followup-comm-history">
            <h3>REMINDER HISTORY <span>{reminders.length} RECORDS</span></h3>
            {reminders.length === 0 ? (
              <p className="followup-comm-empty">No reminder history is available.</p>
            ) : (
              <ul className="followup-history-list">
                {reminders.map((reminder) => (
                  <li className="followup-history-row" key={reminder.id}>
                    <div className="followup-history-main">
                      <strong>{reminder.channel}</strong>
                      <span>{formatDisplayDate(reminder.reminderAt)}</span>
                    </div>
                    <p className="followup-history-note">
                      {reminder.reminderAt?.slice(11, 16) || ""} {reminder.failureReason || ""}
                    </p>
                    <span className={`followup-comm-status ${communicationStatusClassName(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default CommunicationModal;
