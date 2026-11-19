import React from "react";

import { describeDueDate, formatDisplayDate, isCompleted, statusClassName } from "./followUpUtils";

/* =========================================================
   FOLLOW-UP TABLE
   Presentation only. Mutations are delegated to the page.
   ========================================================= */

function FollowUpTable({
  followUps,
  todayKey,
  emptyMessage,
  loading,
  onOpenCommunication,
  onToggleComplete,
  onCancel,
  onEdit,
}) {
  return (
    <div className="followup-table-panel">

      <div className="followup-table-wrapper">

        <table className="followup-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>VEHICLE / REGISTRATION</th>
              <th>FOLLOW-UP TYPE</th>
              <th>DUE DATE</th>
              <th>CHANNEL</th>
              <th>ASSIGNED TO</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {followUps.length === 0 ? (
              <tr>
                <td className="followup-table-state" colSpan={9}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              followUps.map((entry) => {
                const closed = isCompleted(entry) || entry.status === "Cancelled";
                const due = closed
                  ? { label: entry.status, tone: "" }
                  : describeDueDate(entry.dueDate, todayKey);

                return (
                  <tr key={entry.rowId}>

                    <td className="followup-id">
                      {entry.id}
                    </td>


                    <td>
                      <div className="followup-customer">
                        <strong>{entry.customer}</strong>
                        <span>{entry.phone}</span>
                      </div>
                    </td>


                    <td>
                      <div className="followup-vehicle">
                        <strong>{entry.vehicle}</strong>
                        <span>{entry.registration}</span>
                      </div>
                    </td>


                    <td>
                      <div className="followup-type">
                        <strong>{entry.type}</strong>
                        <span>{entry.notes}</span>
                      </div>
                    </td>


                    <td>
                      <div className="followup-due">
                        <strong>{formatDisplayDate(entry.dueDate)}</strong>
                        <span className={`followup-due-note ${due.tone}`}>
                          {due.label}
                        </span>
                      </div>
                    </td>


                    <td className="followup-channel">
                      {entry.channel}
                    </td>


                    <td className="followup-assigned">
                      {entry.assignedTo}
                    </td>


                    <td>
                      <span
                        className={`followup-status ${statusClassName(
                          entry.status
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </td>


                    <td>
                      <div className="followup-row-actions">

                        <button
                          type="button"
                          className="followup-action primary"
                          disabled={loading}
                          onClick={() => onOpenCommunication(entry)}
                        >
                          Message
                        </button>
                        {!closed && <button
                          type="button"
                          className="followup-action"
                          disabled={loading}
                          onClick={() => onEdit(entry)}
                        >Edit</button>}

                        <button
                          type="button"
                          className="followup-action"
                          disabled={closed || loading}
                          onClick={() => onToggleComplete(entry)}
                        >
                          Complete
                        </button>
                        {!closed && <button
                          type="button"
                          className="followup-action"
                          disabled={loading}
                          onClick={() => onCancel(entry)}
                        >Cancel</button>}

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default FollowUpTable;
