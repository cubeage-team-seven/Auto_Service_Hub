/* =========================================================
   GARAGE OWNER — EDIT USER MODAL

   The dialog behind the Edit action on the User Management
   page: header, the editable account fields and the footer
   actions.

   The form opens pre-filled with the selected user's own data —
   the row the page mapped from the API's UserResponseDTO — so
   the admin corrects the record it already holds rather than
   retyping it. The editable fields are the ones the backend's
   update endpoint accepts: full name, username, email, phone,
   role and account status. There is no password field, because
   the API never returns a credential to pre-fill and the update
   endpoint deliberately never touches the password hash.

   The dialog never calls the API itself: it validates, then
   hands the account up through onSubmit in the shape the update
   endpoint expects — the same field names as the create request,
   without the password.

   Validation and error display follow the create-user modal:
   required fields, the email format, and per-field messages
   announced through aria-invalid / aria-describedby.

   Props
     open           boolean  — when false the dialog renders nothing
     user           object   — the mapped user row being edited;
                               when null the dialog renders nothing
     onClose        function — called by the close icon, Cancel and
                               the backdrop
     onSubmit       function — called by the Save Changes submit,
                               with the account fields in the
                               API's shape
     onClearSubmitError
                    function — called when a field changes, so a
                               stale API error is dropped
     roleOptions    string[] — role choices for the Role select
     statusOptions  string[] — status choices for Account Status
     submitting     boolean  — true while the update is running
     submitError    string   — API error to show in the dialog
========================================================= */

import React, { useEffect, useState } from "react";


/* =========================================================
   OPTION LISTS
   The role and status choices belong to the page, so the modal
   renders whichever lists it is given, exactly as they stand.
========================================================= */

const optionsOrEmpty = (options) => (Array.isArray(options) ? options : []);


/* =========================================================
   VALIDATION HELPERS
   The same rules the create dialog applies to the fields the
   two forms share: email pattern, required-field list, and the
   matching message map. A text field holding only whitespace
   counts as empty.
========================================================= */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = [
  "fullName",
  "username",
  "email",
  "phone",
  "role",
];

const REQUIRED_MESSAGES = {
  fullName: "Full Name is required.",
  username: "Username is required.",
  email: "Email is required.",
  phone: "Phone Number is required.",
  role: "Select a role.",
};


/* =========================================================
   THE ROLE AS THE API STORES IT

   The Role list offers Owner, and the roles table keeps the
   garage owner's row under the name GARAGE_OWNER. The Owner
   choice is sent under that name, so the account stays linked
   to the row that already exists - choosing Owner neither
   creates nor renames a role. Every other choice travels
   exactly as it was chosen, same as on create.
========================================================= */

const ROLE_REQUEST_VALUES = {
  Owner: "GARAGE_OWNER",
};

const requestedRoleValue = (roleLabel) =>
  ROLE_REQUEST_VALUES[roleLabel] || roleLabel;


/* =========================================================
   THE ROW AS A FORM

   The page maps API rows into its display shape, where an empty
   value is shown as a dash. That dash is a display marker, not
   data, so the form turns it back into an empty string before it
   is pre-filled. The full name falls back to the username when
   the account has none, so the required field opens filled for
   as many accounts as possible.
========================================================= */

const MISSING_VALUE = "—";

const normalize = (value) => {
  const text = String(value ?? "").trim();
  return text === MISSING_VALUE ? "" : text;
};

const fromUser = (user) => ({
  fullName:
    normalize(user?.fullName) ||
    normalize(user?.username),
  username: normalize(user?.username),
  email: normalize(user?.email),
  phone: normalize(user?.phone),
  role: normalize(user?.role),
  mechanicId: user?.mechanicId == null ? "" : String(user.mechanicId),
  status: normalize(user?.status) || "Active",
});


/* =========================================================
   FIELD ERROR MESSAGE
   Rendered straight under the field it belongs to, using the
   error style already defined for this modal. Renders nothing
   while the field is valid, and the field it describes points
   at it through aria-describedby.
========================================================= */

function FieldError(props) {
  const { id, message } = props;

  if (!message) {
    return null;
  }

  return (
    <span className="garage-users-modal-error" id={id} role="alert">
      {message}
    </span>
  );
}

function GarageOwnerEditUserModal(props) {
  const {
    open,
    user,
    onClose,
    onSubmit,
    onClearSubmitError,
    roleOptions,
    mechanicProfiles,
    mechanicProfilesError,
    statusOptions,
    submitting,
    submitError,
  } = props;

  const [form, setForm] = useState(fromUser(user));
  const [errors, setErrors] = useState({});

  const roleChoices = optionsOrEmpty(roleOptions);
  const profileChoices = optionsOrEmpty(mechanicProfiles);
  const statusChoices = optionsOrEmpty(statusOptions);

  const isSubmitting = Boolean(submitting);

  /* The account keeps its own role and status even when the page's
     option lists do not carry them (a customer account, say): the
     current values are appended as choices so the select renders
     them, and re-saving them sends back exactly what the account
     held. */
  const offeredRoles =
    form.role && !roleChoices.includes(form.role)
      ? [...roleChoices, form.role]
      : roleChoices;

  const offeredStatuses =
    form.status && !statusChoices.includes(form.status)
      ? [...statusChoices, form.status]
      : statusChoices;


  /* =========================================================
     OPENING PRE-FILLS THE FORM FROM THE SELECTED USER
  ========================================================= */

  useEffect(() => {
    if (open && user) {
      setForm(fromUser(user));
      setErrors({});
    }
  }, [open, user]);


  /* =========================================================
     ESC CLOSES THE DIALOG
     Same keydown pattern as the other modals in this module.
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isSubmitting]);


  /* =========================================================
     CLOSED STATE - render nothing
  ========================================================= */

  if (!open || !user) {
    return null;
  }


  /* =========================================================
     INVALID FIELD HELPERS
     The error the form is holding for a field drives everything
     the user sees and hears about it: the red styling of the
     field and of its label, and the message printed under it.
  ========================================================= */

  const isInvalid = (name) => Boolean(errors[name]);

  const fieldClass = (name) =>
    isInvalid(name)
      ? "garage-users-modal-field error"
      : "garage-users-modal-field";

  const inputClass = (name) => (isInvalid(name) ? "error" : undefined);


  /* =========================================================
     FIELD CHANGES
     Every input and select is controlled: the field's own name is
     the key it writes to in the form state.
  ========================================================= */

  const validateField = (name, value, currentForm) => {
    const nextErrors = {};
    const text = value.trim();

    if (name === "fullName") {
      if (!text) nextErrors.fullName = REQUIRED_MESSAGES.fullName;
    } else if (name === "username") {
      if (!text) nextErrors.username = REQUIRED_MESSAGES.username;
    } else if (name === "email") {
      if (!text) {
        nextErrors.email = REQUIRED_MESSAGES.email;
      } else if (!EMAIL_PATTERN.test(text)) {
        nextErrors.email = "Enter a valid email address.";
      }
    } else if (name === "phone") {
      if (!text) nextErrors.phone = REQUIRED_MESSAGES.phone;
    } else if (name === "role") {
      if (!text) nextErrors.role = REQUIRED_MESSAGES.role;
    } else if (name === "mechanicId") {
      if (currentForm.role === "Mechanic" && !text) {
        nextErrors.mechanicId = "Select the mechanic profile for this account.";
      }
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    /* The API error described the account that was submitted, so
       the first edit makes it out of date - same as the other
       modals in this module. */
    if (typeof onClearSubmitError === "function") {
      onClearSubmitError();
    }

    setForm((previous) => {
      const nextForm = { ...previous, [name]: value };
      if (name === "role" && value !== "Mechanic") {
        nextForm.mechanicId = "";
      }

      setErrors((previousErrors) => {
        const fieldErrors = validateField(name, value, nextForm);
        const nextErrors = { ...previousErrors };

        /* The corrected field always drops its own error. */
        delete nextErrors[name];
        Object.assign(nextErrors, fieldErrors);

        return nextErrors;
      });

      return nextForm;
    });
  };

/* =========================================================
     WHOLE-FORM VALIDATION
     Called on submit. Every required field has to hold something
     other than whitespace, and the email has to look like an
     address. The messages are the same ones the per-field checks
     use, so submit and typing can never disagree.
  ========================================================= */

  const validateForm = (currentForm) => {
    const validationErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (!String(currentForm[field] ?? "").trim()) {
        validationErrors[field] = REQUIRED_MESSAGES[field];
      }
    });

    if (
      !validationErrors.email &&
      !EMAIL_PATTERN.test(String(currentForm.email ?? "").trim())
    ) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (currentForm.role === "Mechanic" && !currentForm.mechanicId) {
      validationErrors.mechanicId = "Select the mechanic profile for this account.";
    }

    return validationErrors;
  };

  /* =========================================================
     THE ACCOUNT AS THE UPDATE ENDPOINT EXPECTS IT
     Same field names as the create request, without the password
     - the update endpoint has no password field and preserves the
     existing hash.
  ========================================================= */

  const buildAccount = (currentForm) => {
    const roleLabel = currentForm.role;

    return {
      fullName: currentForm.fullName.trim(),
      username: currentForm.username.trim(),
      email: currentForm.email.trim(),
      phone: currentForm.phone.trim(),
      role: requestedRoleValue(roleLabel),
      ...(roleLabel === "Mechanic" && currentForm.mechanicId
        ? { mechanicId: Number(currentForm.mechanicId) }
        : {}),
      status: currentForm.status.trim(),
    };
  };


  /* =========================================================
     SUBMIT
     Validate first; if any errors exist, prevent submission.
     onSubmit is called only when all fields are valid, and not
     while a previous update request is still running.
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validateForm(form);
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (typeof onSubmit === "function") {
      onSubmit(buildAccount(form));
    }
  };


  return (
    <div
      className="garage-users-modal-overlay"
      onMouseDown={(event) => {
        // Only a click on the backdrop itself closes the dialog,
        // and never while an update request is in flight; clicks
        // inside the panel keep it open.
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >

      <div
        className="garage-users-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="garage-users-edit-title"
      >

        <div className="garage-users-modal-header">

          <h2 id="garage-users-edit-title">
            Edit User
          </h2>

          <button
            type="button"
            className="garage-users-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit user dialog"
          >
            ×
          </button>

        </div>


        <form className="garage-users-modal-form" onSubmit={handleSubmit}>

          {/* =====================================================
              ACCOUNT FIELDS
              Pre-filled from the selected user's own data. Every
              field except the account status is required. Two
              columns on wider screens, one below 620px.
          ===================================================== */}

          <div className="garage-users-modal-fields">

            {/* FULL NAME + USERNAME */}

            <div className="garage-users-modal-row">

              <div className={fieldClass("fullName")}>

                <label htmlFor="garage-users-edit-full-name">
                  FULL NAME
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

<input
                  id="garage-users-edit-full-name"
                  type="text"
                  name="fullName"
                  placeholder="Arjun Mehta"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass("fullName")}
                  aria-invalid={isInvalid("fullName") ? "true" : undefined}
                  aria-describedby={
                    isInvalid("fullName")
                      ? "garage-users-edit-full-name-error"
                      : undefined
                  }
                  required
                />

                <FieldError
                  id="garage-users-edit-full-name-error"
                  message={errors.fullName}
                />

              </div>


              <div className={fieldClass("username")}>

                <label htmlFor="garage-users-edit-username">
                  USERNAME
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

                <input
                  id="garage-users-edit-username"
                  type="text"
                  name="username"
                  placeholder="arjun.mehta"
                  value={form.username}
                  onChange={handleChange}
                  className={inputClass("username")}
                  aria-invalid={isInvalid("username") ? "true" : undefined}
                  aria-describedby={
                    isInvalid("username")
                      ? "garage-users-edit-username-error"
                      : undefined
                  }
                  required
                />

                <FieldError
                  id="garage-users-edit-username-error"
                  message={errors.username}
                />

              </div>

            </div>


            {/* EMAIL + PHONE NUMBER */}

            <div className="garage-users-modal-row">

              <div className={fieldClass("email")}>

                <label htmlFor="garage-users-edit-email">
                  EMAIL ADDRESS
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

<input
                  id="garage-users-edit-email"
                  type="email"
                  name="email"
                  placeholder="arjun.mehta@smartgarage.in"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                  aria-invalid={isInvalid("email") ? "true" : undefined}
                  aria-describedby={
                    isInvalid("email")
                      ? "garage-users-edit-email-error"
                      : undefined
                  }
                  required
                />

                <FieldError
                  id="garage-users-edit-email-error"
                  message={errors.email}
                />

              </div>


              <div className={fieldClass("phone")}>

                <label htmlFor="garage-users-edit-phone">
                  PHONE NUMBER
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

                <input
                  id="garage-users-edit-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass("phone")}
                  aria-invalid={isInvalid("phone") ? "true" : undefined}
                  aria-describedby={
                    isInvalid("phone")
                      ? "garage-users-edit-phone-error"
                      : undefined
                  }
                  required
                />

                <FieldError
                  id="garage-users-edit-phone-error"
                  message={errors.phone}
                />

              </div>

            </div>


            {/* ROLE + ACCOUNT STATUS */}

            <div className="garage-users-modal-row">

              <div className={fieldClass("role")}>

                <label htmlFor="garage-users-edit-role">
                  ROLE
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

                <select
                  id="garage-users-edit-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClass("role")}
                  aria-invalid={isInvalid("role") ? "true" : undefined}
                  aria-describedby={
                    isInvalid("role")
                      ? "garage-users-edit-role-error"
                      : undefined
                  }
                  required
                >
                  <option value="">
                    Select a role
                  </option>

                  {offeredRoles.map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <FieldError
                  id="garage-users-edit-role-error"
                  message={errors.role}
                />

              </div>


              <div className="garage-users-modal-field">

                <label htmlFor="garage-users-edit-status">
                  ACCOUNT STATUS
                  <span
                    className="garage-users-modal-required"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </label>

                <select
                  id="garage-users-edit-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  {offeredStatuses.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {form.role === "Mechanic" && (
              <div className="garage-users-modal-row">
                <div className={fieldClass("mechanicId")}>
                  <label htmlFor="garage-users-edit-mechanic-profile">
                    MECHANIC PROFILE
                    <span className="garage-users-modal-required" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="garage-users-edit-mechanic-profile"
                    name="mechanicId"
                    value={form.mechanicId}
                    onChange={handleChange}
                    className={inputClass("mechanicId")}
                    aria-invalid={isInvalid("mechanicId") ? "true" : undefined}
                    aria-describedby={
                      isInvalid("mechanicId")
                        ? "garage-users-edit-mechanic-profile-error"
                        : undefined
                    }
                    required
                  >
                    <option value="">
                      {profileChoices.length > 0
                        ? "Select an unlinked mechanic profile"
                        : "No unlinked mechanic profiles available"}
                    </option>
                    {profileChoices.map((profile) => (
                      <option value={profile.id} key={profile.id}>
                        {profile.employeeCode || `#${profile.id}`} — {profile.name}
                        {profile.status ? ` (${profile.status})` : ""}
                      </option>
                    ))}
                  </select>
                  {mechanicProfilesError && (
                    <span className="garage-users-modal-error" role="alert">
                      Mechanic profiles could not be loaded: {mechanicProfilesError}
                    </span>
                  )}
                  <FieldError
                    id="garage-users-edit-mechanic-profile-error"
                    message={errors.mechanicId}
                  />
                </div>
              </div>
            )}

          </div>

{/* =====================================================
              API ERROR

              Whatever the update request was refused with: the
              backend's field validation text, or the conflict
              raised because the username or email is already in
              use or the role does not exist.
          ===================================================== */}

          {submitError && (
            <div
              className="garage-users-modal-api-error"
              role="alert"
            >
              {submitError}
            </div>
          )}


          <div className="garage-users-modal-footer">

            <button
              type="button"
              className="garage-users-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="garage-users-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default GarageOwnerEditUserModal;