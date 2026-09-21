import React, { useState } from "react";
import "./GarageOwnerAIHub.css";

const aiAlerts = [
  {
    icon: "🔍",
    title: "Battery Problem Detected",
    description:
      "MH-12-AB-4521 — slow start. Battery degradation suspected.",
    confidence: "85%",
    button: "Recommend load test",
  },
  {
    icon: "🗓️",
    title: "Tyre Replacement Due",
    description:
      "DL-01-CZ-9834 — 42,000 km. ~3,000 km until tyre life exhausted.",
    confidence: "78%",
    button: "Send reminder",
  },
  {
    icon: "📦",
    title: "Low Stock: Oil Filter",
    description:
      "OIF-3301 stock at 2 units. Stockout in ~2 days.",
    confidence: "92%",
    button: "Raise purchase order",
  },
  {
    icon: "🔧",
    title: "Mechanic Assignment",
    description:
      "JC-2408 engine overhaul → Ravi Kumar (8 yrs, 4.9★) recommended.",
    confidence: "96%",
    button: "Accept assignment",
  },
  {
    icon: "💰",
    title: "Cost Estimate: JC-2404",
    description:
      "Suspension + Tyres (Fortuner): Parts ₹24,000 + Labour ₹8,000.",
    confidence: "88%",
    button: "Create estimate",
  },
];

function GarageOwnerAIHub() {
  const [alerts, setAlerts] = useState(aiAlerts);

  const handleDismiss = (index) => {
    setAlerts((currentAlerts) =>
      currentAlerts.filter((_, alertIndex) => alertIndex !== index)
    );
  };

  const handleAction = (alert) => {
    alertMessage(alert.button);
  };

  return (
    <div className="garage-ai-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="garage-ai-page-header">

        <div className="garage-ai-heading">

          <div className="garage-ai-eyebrow">
            — AI ASSISTANCE LAYER
          </div>

          <h1>SMARTGARAGE AI</h1>

          <p>
            All AI outputs require human confirmation before affecting
            operational decisions.
          </p>

        </div>

      </div>


      {/* =====================================================
          AI ALERTS
      ===================================================== */}

      <div className="garage-ai-grid">

        {alerts.map((item, index) => (

          <div
            className="garage-ai-card"
            key={`${item.title}-${index}`}
          >

            {/* CARD TOP */}

            <div className="garage-ai-card-main">

              <div className="garage-ai-icon">
                {item.icon}
              </div>

              <div className="garage-ai-card-content">

                <h2>
                  {item.title}
                </h2>

                <p>
                  {item.description}
                </p>

              </div>

              <div className="garage-ai-confidence">

                <div className="garage-ai-confidence-bar">

                  <span
                    style={{
                      width: item.confidence,
                    }}
                  ></span>

                </div>

                <strong>
                  {item.confidence}
                </strong>

              </div>

            </div>


            {/* CARD ACTIONS */}

            <div className="garage-ai-actions">

              <button
                type="button"
                className="garage-ai-primary-button"
                onClick={() => handleAction(item)}
              >
                {item.button}
              </button>

              <button
                type="button"
                className="garage-ai-dismiss-button"
                onClick={() => handleDismiss(index)}
              >
                Dismiss
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


/* =========================================================
   ACTION
========================================================= */

function alertMessage(message) {
  window.alert(`${message} will be connected later.`);
}

export default GarageOwnerAIHub;