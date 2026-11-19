/* =========================================================
   GARAGE OWNER — USER DETAILS VIEW MODAL

   The read-only dialog behind the View action on the User
   Management page. It shows the account exactly as the page's
   own list carries it: the row that was clicked on was mapped
   from the API's UserResponseDTO, so every value here is the
   user's own stored data — nothing is fetched again and nothing
   is hardcoded.

   The dialog reuses the create-user modal's shell classes, so it
   shares the page's panel, header, backdrop and footer styling.
   Only the value boxes are new (garage-users-view-value):
   read-only text styled with the same tokens as the form's
   inputs. The status reuses the table's own badge, so the two
   read the same way everywhere.

   Props
     open    boolean  — when false the dialog renders nothing
     user    object   — the mapped user row to display; when null
                        the dialog renders nothing
     onClose function — called by the close icon, Close and the
                        backdrop
========================================================= */

import React, { useEffect } from "react";

/* Rendered wherever the account has nothing to show. */
const MISSING_VALUE = "—";

const displayValue = (value) => String(value ?? "").trim() || MISSING_VALUE;

function GarageOwnerUserViewModal(props) {
  const { open, user, onClose } = props;

  /* ESC closes the dialog — same pattern as the other modals. */
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) {
    return null;
  }

  const isActive = user.active === true;

  return (
    <div
      className="garage-users-modal-overlay"
      onMouseDown={(event) => {
        // Only a click on the backdrop itself closes the dialog;
        // clicks inside the panel keep it open.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div
        className="garage-users-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="garage-users-view-title"
      >

        <div className="garage-users-modal-header">

          <h2 id="garage-users-view-title">
            User Details
          </h2>

          <button
            type="button"
            className="garage-users-modal-close"
            onClick={onClose}
            aria-label="Close user details dialog"
          >
            ×
          </button>

        </div>


        <div className="garage-users-modal-form">

          <div className="garage-users-modal-fields">

            <div className="garage-users-modal-row">

              <div className="garage-users-modal-field">

                <label>
                  FULL NAME
                </label>

                <div className="garage-users-view-value">
                  {displayValue(user.fullName || user.username)}
                </div>

              </div>


              <div className="garage-users-modal-field">

                <label>
                  USERNAME
                </label>

                <div className="garage-users-view-value">
                  {displayValue(user.username)}
                </div>

              </div>

            </div>


            <div className="garage-users-modal-row">

              <div className="garage-users-modal-field">

                <label>
                  EMAIL ADDRESS
                </label>

                <div className="garage-users-view-value">
                  {displayValue(user.email)}
                </div>

              </div>


              <div className="garage-users-modal-field">

                <label>
                  PHONE NUMBER
                </label>

                <div className="garage-users-view-value">
                  {displayValue(user.phone)}
                </div>

              </div>

            </div>


            <div className="garage-users-modal-row">

              <div className="garage-users-modal-field">

                <label>
                  ROLE
                </label>

                <div className="garage-users-view-value">
                  {displayValue(user.role)}
                </div>

              </div>


              <div className="garage-users-modal-field">

                <label>
                  ACCOUNT STATUS
                </label>

                <div className="garage-users-view-value">
                  <span
                    className={
                      isActive
                        ? "garage-users-status active"
                        : "garage-users-status inactive"
                    }
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>


        <div className="garage-users-modal-footer">

          <button
            type="button"
            className="garage-users-modal-submit"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default GarageOwnerUserViewModal;
