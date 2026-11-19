import React from "react";
import { formatDisplayDate, loyaltyTierClassName } from "./followUpUtils";

function RetentionPanel({ retention, summary }) {
  const maxVisits = retention.reduce((max, entry) => Math.max(max, entry.visits || 0), 1);
  return (
    <section className="followup-section" aria-label="Retention overview">
      <div className="followup-section-head">
        <div>
          <h2>CUSTOMER RETENTION</h2>
          <p>Workshop customer records and delivered-service history.</p>
        </div>
        <div className="followup-section-metrics">
          <span><strong>{summary.active}</strong>WITH SERVICE HISTORY</span>
          <span><strong>{summary.newCustomers}</strong>NO DELIVERED VISITS</span>
        </div>
      </div>
      {retention.length === 0 ? (
        <p className="followup-empty-note">No customer records are available.</p>
      ) : (
        <div className="followup-retention-grid">
          <div className="followup-table-panel">
            <div className="followup-table-wrapper">
              <table className="followup-table followup-retention-table">
                <thead><tr><th>CUSTOMER</th><th>LOYALTY TIER</th><th>DELIVERED VISITS</th><th>LAST SERVICE</th></tr></thead>
                <tbody>
                  {retention.map((entry) => (
                    <tr key={entry.id}>
                      <td><div className="followup-customer"><strong>{entry.customer}</strong><span>{entry.phone || "—"}</span></div></td>
                      <td><span className={`followup-loyalty ${loyaltyTierClassName(entry.loyaltyTier)}`}>{entry.loyaltyTier}</span></td>
                      <td className="followup-count">{entry.visits}</td>
                      <td className="followup-muted">{formatDisplayDate(entry.lastVisit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="followup-retention-side">
            <div className="followup-subpanel">
              <h3>DELIVERED VISITS BY CUSTOMER</h3>
              <div className="followup-bars">
                {retention.slice(0, 10).map((entry) => (
                  <div className="followup-bar-row" key={entry.id}>
                    <div className="followup-bar-label"><strong>{entry.customer}</strong><span>{entry.visits} visits</span></div>
                    <div className="followup-bar-track">
                      <div className="followup-bar-fill" style={{ width: `${Math.round((entry.visits / maxVisits) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RetentionPanel;
