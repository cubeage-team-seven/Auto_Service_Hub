import React, { useCallback, useEffect, useMemo, useState } from "react";
import GarageOwnerCreateUserModal from "./GarageOwnerCreateUserModal";
import GarageOwnerUserViewModal from "./GarageOwnerUserViewModal";
import GarageOwnerEditUserModal from "./GarageOwnerEditUserModal";
import { getMechanics } from "../../services/mechanicService";
import { createUser, getUsers, removeUser, updateUser } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import "./GarageOwnerUsers.css";

/* =========================================================
   USER ROWS — GET /api/v1/users

   The table on this page is the API's own list: getUsers()
   reads every page of GET /api/v1/users, and each
   UserResponseDTO is mapped into the row shape the table, the
   search and the filters work with.

   `fullName` becomes the row's name, `active` becomes the
   Active / Inactive label the status badge shows, and `role` is
   turned into a readable label — the API returns the name the
   roles table stores (GARAGE_OWNER, SERVICE_ADVISOR, ...), and
   the two spellings the garage owner's account is kept under,
   GARAGE_OWNER and OWNER, both read as "Owner". Email and phone
   are optional on an account, so a row keeps an empty string for
   them and the table shows a dash rather than a hole.

   Create and Remove are writes through userService, each followed by
   a reload of this same list.
   View and Edit each open the selected row in a dialog of its
   own — View shows the account as the list holds it, Edit
   updates the profile fields, role and account status through
   PUT /api/v1/users/{id} and reloads this same list. An update
   never touches the password hash. Removal is confirmed in a dialog
   and is limited to workshop accounts other than the signed-in owner.
========================================================= */

const ROLE_LABELS = {
  OWNER: "Owner",
  GARAGE_OWNER: "Owner",
  MANAGER: "Manager",
  SERVICE_ADVISOR: "Service Advisor",
  MECHANIC: "Mechanic",
  INVENTORY_MANAGER: "Inventory Manager",
  BILLING_USER: "Billing User",
  CUSTOMER: "Customer",
};

const WORKSHOP_USER_ROLE_LABELS = new Set([
  "Owner",
  "Manager",
  "Service Advisor",
  "Mechanic",
  "Inventory Manager",
  "Billing User",
]);

/* The order the Role filter offers its labels in: the roles the roles
   table seeds first, so the filter reads the way it always has, and
   anything else the API returns after them, in alphabetical order. */
const ROLE_LABEL_ORDER = [
  "Owner",
  "Manager",
  "Service Advisor",
  "Mechanic",
  "Inventory Manager",
  "Billing User",
  "Customer",
];

/* Rendered wherever the API has nothing to show. */
const MISSING_VALUE = "—";

/* A stored role name — GARAGE_OWNER, SERVICE_ADVISOR, or a label that
   already reads as prose — as the label the row and the filter show. */
const toRoleLabel = (role) => {
  const stored = String(role ?? "")
    .trim()
    .replace(/^ROLE_/i, "")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  if (!stored) {
    return MISSING_VALUE;
  }

  if (ROLE_LABELS[stored]) {
    return ROLE_LABELS[stored];
  }

  return stored
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const mapUser = (user, mechanics = []) => {
  const isActive = user?.active === true;
  const linkedMechanic = mechanics.find(
    (mechanic) => String(mechanic.userId) === String(user?.id)
  );

  return {
    id: user?.id ?? null,
    fullName: String(user?.fullName ?? "").trim(),
    name:
      String(user?.fullName ?? "").trim() ||
      String(user?.username ?? "").trim() ||
      MISSING_VALUE,
    username: String(user?.username ?? "").trim() || MISSING_VALUE,
    email: String(user?.email ?? "").trim(),
    phone: String(user?.phone ?? "").trim(),
    role: toRoleLabel(user?.role),
    active: isActive,
    status: isActive ? "Active" : "Inactive",
    mechanicId: linkedMechanic?.id ?? null,
  };
};

/* How a message names the account it is about. */
const describeUser = (user, fallback = "The user") =>
  String(user?.fullName ?? "").trim() ||
  String(user?.username ?? "").trim() ||
  fallback;

/* =========================================================
   FILTER OPTIONS
========================================================= */

const ALL_ROLES = "All Roles";
const ALL_STATUSES = "All Status";

/* The Role filter offers the labels the loaded rows actually carry
   (see roleFilters below), so every account on screen can be
   filtered by its own role — a customer account included. The
   create-user dialog's list is a separate one; see ROLE_OPTIONS
   below. */

const STATUS_FILTERS = [ALL_STATUSES, "Active", "Inactive"];

/* =========================================================
   CREATE USER DIALOG OPTIONS

   The status choices are the filter list without its
   "All Status" entry, which is a filter sentinel rather than a
   real account value.

   The role choices are written out in full rather than taken
   from the Role filter: the roles table keeps the garage owner's
   row under one name, so the dialog offers that one role rather
   than a label naming two, and an account is given the role it
   is meant to have. The two lists are deliberately kept apart —
   the filter describes the rows on screen, the dialog describes
   what the create endpoint accepts.
========================================================= */

const ROLE_OPTIONS = [
  "Owner",
  "Manager",
  "Service Advisor",
  "Mechanic",
  "Inventory Manager",
  "Billing User",
];

const STATUS_OPTIONS = STATUS_FILTERS.filter(
  (status) => status !== ALL_STATUSES
);

/* =========================================================
   EDIT DIALOG OPTIONS

   The edit dialog offers the same role and status choices as
   the create dialog: the role choices describe what the
   backend's assignable staff roles are, and the status choices
   are the account values minus the filter's "All Status"
   sentinel.
========================================================= */


function GarageOwnerUsers() {
  const { user: authenticatedUser } = useAuth();
  const authenticatedRole = String(authenticatedUser?.role ?? "")
    .trim()
    .replace(/^ROLE_/i, "")
    .toUpperCase();
  const canRemoveUsers =
    authenticatedRole === "OWNER" || authenticatedRole === "GARAGE_OWNER";
  const authenticatedUsername = String(authenticatedUser?.username ?? "")
    .trim()
    .toLowerCase();
  const [users, setUsers] = useState([]);
  const [mechanicProfiles, setMechanicProfiles] = useState([]);
  const [mechanicProfileError, setMechanicProfileError] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(ALL_ROLES);
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [updateUserError, setUpdateUserError] = useState("");
  const [removeUserCandidate, setRemoveUserCandidate] = useState(null);
  const [isRemovingUser, setIsRemovingUser] = useState(false);
  const [removeUserError, setRemoveUserError] = useState("");

  /* =========================================================
     LOAD THE LIST — GET /api/v1/users

     The page opens on the API's list, and this same loader runs
     again after a user is created so the new account is in it.
     A failed read is reported in the banner above the table and
     leaves the rows already on screen alone. The call never
     throws: it reports whether the list is current, which is how
     the create flow tells "the account was saved" apart from
     "the list was reloaded".
  ========================================================= */

  const loadUsers = useCallback(
    async ({ showLoading = true, savedUser = null, savedVerb = "created" } = {}) => {
      if (showLoading) {
        setIsLoadingUsers(true);
      }

      setLoadError("");

      try {
        const [usersResult, mechanicsResult] = await Promise.allSettled([
          getUsers(),
          getMechanics(),
        ]);
        if (usersResult.status === "rejected") {
          throw usersResult.reason;
        }

        const profiles = mechanicsResult.status === "fulfilled"
          ? mechanicsResult.value
          : [];
        setMechanicProfiles(profiles);
        setMechanicProfileError(
          mechanicsResult.status === "rejected"
            ? mechanicsResult.reason?.message || "Mechanic profiles could not be loaded."
            : ""
        );
        setUsers(usersResult.value.map((user) => mapUser(user, profiles)));

        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load the user list.";

        setLoadError(
          savedUser
            ? `${describeUser(savedUser)} was ${savedVerb}, but the list could not be refreshed. ${message}`
            : message
        );

        return false;
      } finally {
        if (showLoading) {
          setIsLoadingUsers(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  /* =========================================================
     SUMMARY COUNTS — counted from the users the API returned
  ========================================================= */

  const summary = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.active).length,
      inactive: users.filter((user) => !user.active).length,
    }),
    [users]
  );

  /* =========================================================
     ROLE FILTER OPTIONS — the labels the loaded rows carry

     Built from the list rather than written out, so a role the
     rows actually have can be selected even when it is not one
     the create dialog offers — a customer account, say. The
     labels the roles table seeds keep the order they had.
  ========================================================= */

  const roleFilters = useMemo(() => {
    const labels = new Set(users.map((user) => user.role));
    const seeded = ROLE_LABEL_ORDER.filter((label) => labels.has(label));
    const other = Array.from(labels)
      .filter((label) => !ROLE_LABEL_ORDER.includes(label))
      .sort((first, second) => first.localeCompare(second));

    return [ALL_ROLES, ...seeded, ...other];
  }, [users]);

  /* A reload can retire the label that is currently selected — the
     last customer account gone, say — so the selection falls back
     to All Roles rather than leaving the select on a value that is
     no longer one of its options. */
  useEffect(() => {
    if (roleFilter !== ALL_ROLES && !roleFilters.includes(roleFilter)) {
      setRoleFilter(ALL_ROLES);
    }
  }, [roleFilter, roleFilters]);

  /* =========================================================
     SEARCH + FILTERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !value ||
        String(user.name ?? "").toLowerCase().includes(value) ||
        String(user.email ?? "").toLowerCase().includes(value);

      const matchesRole =
        roleFilter === ALL_ROLES || user.role === roleFilter;

      const matchesStatus =
        statusFilter === ALL_STATUSES || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    roleFilter !== ALL_ROLES ||
    statusFilter !== ALL_STATUSES;

  const resetFilters = () => {
    setSearch("");
    setRoleFilter(ALL_ROLES);
    setStatusFilter(ALL_STATUSES);
  };

  /* =========================================================
     CREATE USER DIALOG

     The Create User button opens the dialog. The dialog's own
     close icon, Cancel, backdrop click and Escape all report
     through onClose, so nothing extra is needed for them here —
     but none of them may dismiss the dialog while a create
     request is in flight, so the close path is held until the
     post comes back.
  ========================================================= */

  const openCreateUser = () => {
    setCreateUserError("");
    setIsCreateUserOpen(true);
  };

  const closeCreateUser = () => {
    if (isCreatingUser) {
      return;
    }

    setCreateUserError("");
    setIsCreateUserOpen(false);
  };

  /* =========================================================
     CREATE USER — POST /api/v1/users

     The dialog validates its fields and hands the account up in
     the shape UserRequestDTO expects; the API owns the account
     itself (it hashes the password and resolves the role name
     against the roles table).

     On success the dialog closes, the account is confirmed in the
     banner, and the list is reloaded so the new account is in it.
     The two outcomes are reported apart from each other: if that
     reload fails, the confirmation above still stands on its own
     and the error banner names the list — not the save — as the
     part that failed.

     On failure the dialog stays open and the API's own message
     is shown inside it — the validation text for a field the
     backend refused, or the conflict raised because the username
     or email is already in use.
  ========================================================= */

  const handleCreateUserSubmit = async (account) => {
    if (isCreatingUser) {
      return;
    }

    setIsCreatingUser(true);
    setCreateUserError("");
    setSuccessMessage("");

    try {
      const savedUser = await createUser(account);

      setIsCreateUserOpen(false);
      setSuccessMessage(
        `${describeUser(savedUser, "User")} created successfully.`
      );

      await loadUsers({ showLoading: false, savedUser });
    } catch (error) {
      setCreateUserError(
        error instanceof Error ? error.message : "Unable to create the user."
      );
    } finally {
      setIsCreatingUser(false);
    }
  };

  /* =========================================================
     VIEW USER DIALOG

     The row's own data is the API's data: the list was loaded
     from GET /api/v1/users, so the dialog displays whatever the
     selected row already holds. View is a pure read — nothing is
     fetched again and nothing is written.
  ========================================================= */

  const closeViewUser = () => setViewUser(null);

  /* =========================================================
     EDIT USER DIALOG

     The dialog opens pre-filled from the selected row, validates
     its own fields and hands the account up in the shape
     UserUpdateDTO expects; the API owns the account itself (it
     resolves the role name against the roles table and preserves
     the password hash).

     On success the dialog closes, the account is confirmed in
     the banner, and the list is reloaded so the change is
     reflected in it. The two outcomes are reported apart from
     each other: if that reload fails, the confirmation above
     still stands on its own and the error banner names the list
     — not the save — as the part that failed.

     On failure the dialog stays open and the API's own message
     is shown inside it — the validation text for a field the
     backend refused, or the conflict raised because the username
     or email is already in use.
  ========================================================= */

  const openEditUser = (user) => {
    setUpdateUserError("");
    setEditUser(user);
  };

  const closeEditUser = () => {
    if (isSavingUser) {
      return;
    }

    setUpdateUserError("");
    setEditUser(null);
  };

  const handleEditUserSubmit = async (account) => {
    if (isSavingUser || !editUser) {
      return;
    }

    setIsSavingUser(true);
    setUpdateUserError("");
    setSuccessMessage("");

    try {
      const savedUser = await updateUser(editUser.id, account);

      setEditUser(null);
      setSuccessMessage(
        `${describeUser(savedUser, "User")} updated successfully.`
      );

      await loadUsers({ showLoading: false, savedUser, savedVerb: "updated" });
    } catch (error) {
      setUpdateUserError(
        error instanceof Error ? error.message : "Unable to update the user."
      );
    } finally {
      setIsSavingUser(false);
    }
  };

  const openRemoveUser = (user) => {
    if (!canRemoveUsers) {
      return;
    }
    setRemoveUserError("");
    setSuccessMessage("");
    setRemoveUserCandidate(user);
  };

  const closeRemoveUser = () => {
    if (isRemovingUser) {
      return;
    }
    setRemoveUserCandidate(null);
    setRemoveUserError("");
  };

  const handleRemoveUser = async () => {
    if (!canRemoveUsers || isRemovingUser || !removeUserCandidate) {
      return;
    }

    setIsRemovingUser(true);
    setRemoveUserError("");
    try {
      const removedId = await removeUser(removeUserCandidate.id);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => String(user.id) !== String(removedId))
      );
      setLoadError("");
      setRemoveUserCandidate(null);
      setSuccessMessage(
        `${describeUser(removeUserCandidate)} removed successfully.`
      );
      try {
        const profiles = await getMechanics();
        setMechanicProfiles(profiles);
        setMechanicProfileError("");
      } catch (error) {
        setMechanicProfileError(
          error instanceof Error
            ? error.message
            : "Mechanic profiles could not be refreshed."
        );
      }
    } catch (error) {
      setRemoveUserError(
        error instanceof Error ? error.message : "Unable to remove the user."
      );
    } finally {
      setIsRemovingUser(false);
    }
  };

  return (
    <div className="garage-users-page">

      {/* =====================================================
          PAGE TITLE + CREATE BUTTON
      ===================================================== */}

      <div className="garage-users-page-top">

        <div className="garage-users-page-title">

          <div className="garage-users-eyebrow">
            — USER MANAGEMENT
          </div>

          <h1>
            USER MANAGEMENT
          </h1>

          <p>
            Manage workshop users, roles and account status.
          </p>

        </div>


        <button
          type="button"
          className="garage-users-create-button"
          onClick={openCreateUser}
        >
          + CREATE USER
        </button>

      </div>


      {/* =====================================================
          FEEDBACK BANNERS
      ===================================================== */}

      {successMessage && (
        <div className="garage-users-feedback" role="status">
          <span>
            {successMessage}
          </span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {loadError && (
        <div className="garage-users-feedback error" role="alert">
          <span>
            {loadError}
          </span>

          <button
            type="button"
            onClick={() => void loadUsers()}
          >
            Retry
          </button>
        </div>
      )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="garage-users-stats">

        <div className="garage-users-stat-card">

          <span>
            TOTAL USERS
          </span>

          <strong>
            {summary.total}
          </strong>

          <small>
            All workshop accounts
          </small>

        </div>


        <div className="garage-users-stat-card">

          <span>
            ACTIVE USERS
          </span>

          <strong className="lime">
            {summary.active}
          </strong>

          <small>
            Accounts with sign-in access
          </small>

        </div>


        <div className="garage-users-stat-card">

          <span>
            INACTIVE USERS
          </span>

          <strong>
            {summary.inactive}
          </strong>

          <small>
            Accounts currently disabled
          </small>

        </div>

      </div>


      {/* =====================================================
          SEARCH + ROLE / STATUS FILTERS
      ===================================================== */}

      <div className="garage-users-filters">

        <div className="garage-users-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users by name or email"
          />

        </div>


        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter users by role"
        >

          {roleFilters.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}

        </select>


        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter users by account status"
        >

          {STATUS_FILTERS.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}

        </select>

      </div>


      {/* =====================================================
          USER TABLE
      ===================================================== */}

      <div className="garage-users-table-card">

        <div className="garage-users-table-heading">

          <strong>
            WORKSHOP USERS
          </strong>

          <span>
            {filteredUsers.length} OF {users.length} USERS
          </span>

        </div>


        <div className="garage-users-table-wrapper">

          <table className="garage-users-table">

            <thead>

              <tr>
                <th>NAME</th>
                <th>USERNAME / EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>

            </thead>

            <tbody>

              {isLoadingUsers && users.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="garage-users-empty"
                  >

                    <div className="garage-users-empty-state">

                      <strong>
                        Loading workshop users
                      </strong>

                      <p>
                        Reading the user list from GET /api/v1/users.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    <td>

                      <span className="garage-users-name">
                        {user.name}
                      </span>

                    </td>

                    <td>

                      <span className="garage-users-identity">

                        <span className="garage-users-username">
                          {user.username}
                        </span>

                        <span className="garage-users-email">
                          {user.email || MISSING_VALUE}
                        </span>

                        <span className="garage-users-phone">
                          {user.phone || MISSING_VALUE}
                        </span>

                      </span>

                    </td>

                    <td>

                      <span className="garage-users-role">
                        {user.role}
                      </span>

                    </td>

                    <td>

                      <span
                        className={
                          user.status === "Active"
                            ? "garage-users-status active"
                            : "garage-users-status inactive"
                        }
                      >
                        {user.status}
                      </span>

                    </td>

                    <td>

                      <div className="garage-users-actions">

                        <button
                          type="button"
                          className="garage-users-action-button"
                          onClick={() => setViewUser(user)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="garage-users-action-button"
                          onClick={() => openEditUser(user)}
                        >
                          Edit
                        </button>

                        {canRemoveUsers && (() => {
                          const isCurrentUser =
                            authenticatedUsername !== "" &&
                            user.username.toLowerCase() === authenticatedUsername;
                          const canRemoveTarget =
                            WORKSHOP_USER_ROLE_LABELS.has(user.role);
                          const disabled =
                            isCurrentUser || !canRemoveTarget || isRemovingUser;

                          return (
                            <button
                              type="button"
                              className="garage-users-action-button remove"
                              onClick={() => openRemoveUser(user)}
                              disabled={disabled}
                              title={
                                isCurrentUser
                                  ? "You cannot remove your own account."
                                  : !canRemoveTarget
                                    ? "Only workshop user accounts can be removed."
                                    : undefined
                              }
                              aria-label={`Remove ${user.name}`}
                            >
                              Remove
                            </button>
                          );
                        })()}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="garage-users-empty"
                  >

                    <div className="garage-users-empty-state">

                      <strong>
                        {loadError
                          ? "Workshop users could not be loaded"
                          : hasActiveFilters
                            ? "No users match your search or filters"
                            : "No workshop users are listed yet"}
                      </strong>

                      <p>
                        {loadError
                          ? "The user list could not be read from the API. Use Retry in the banner above to try again."
                          : hasActiveFilters
                            ? "Try a different name or email, or reset the role and status filters."
                            : "No accounts have been created yet — use the Create User button to add the first one."}
                      </p>

                      {!loadError && hasActiveFilters && (
                        <button
                          type="button"
                          className="garage-users-empty-reset"
                          onClick={resetFilters}
                        >
                          RESET FILTERS
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          USER DIALOGS
      ===================================================== */}

      <GarageOwnerCreateUserModal
        open={isCreateUserOpen}
        onClose={closeCreateUser}
        onSubmit={handleCreateUserSubmit}
        onClearSubmitError={() => setCreateUserError("")}
        roleOptions={ROLE_OPTIONS}
        mechanicProfiles={mechanicProfiles.filter((profile) => !profile.userId)}
        mechanicProfilesError={mechanicProfileError}
        statusOptions={STATUS_OPTIONS}
        submitting={isCreatingUser}
        submitError={createUserError}
      />

      <GarageOwnerUserViewModal
        open={Boolean(viewUser)}
        user={viewUser}
        onClose={closeViewUser}
      />

      <GarageOwnerEditUserModal
        open={Boolean(editUser)}
        user={editUser}
        onClose={closeEditUser}
        onSubmit={handleEditUserSubmit}
        onClearSubmitError={() => setUpdateUserError("")}
        roleOptions={ROLE_OPTIONS}
        mechanicProfiles={mechanicProfiles.filter(
          (profile) =>
            !profile.userId ||
            String(profile.userId) === String(editUser?.id)
        )}
        mechanicProfilesError={mechanicProfileError}
        statusOptions={STATUS_OPTIONS}
        submitting={isSavingUser}
        submitError={updateUserError}
      />

      {removeUserCandidate && (
        <div className="garage-users-modal-overlay">
          <section
            className="garage-users-modal garage-users-remove-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="garage-users-remove-title"
            aria-describedby="garage-users-remove-description"
          >
            <header className="garage-users-modal-header">
              <h2 id="garage-users-remove-title">REMOVE USER</h2>
              <button
                type="button"
                className="garage-users-modal-close"
                onClick={closeRemoveUser}
                disabled={isRemovingUser}
                aria-label="Close dialog"
              >
                ×
              </button>
            </header>

            <div className="garage-users-remove-body">
              <p id="garage-users-remove-description">
                Are you sure you want to remove this user? This action cannot be undone.
              </p>
              <strong>{describeUser(removeUserCandidate)}</strong>
              {removeUserError && (
                <p className="garage-users-modal-api-error" role="alert">
                  {removeUserError}
                </p>
              )}
              <div className="garage-users-modal-footer">
                <button
                  type="button"
                  className="garage-users-modal-cancel"
                  onClick={closeRemoveUser}
                  disabled={isRemovingUser}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="garage-users-remove-submit"
                  onClick={() => void handleRemoveUser()}
                  disabled={isRemovingUser}
                >
                  {isRemovingUser ? "REMOVING..." : "REMOVE USER"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

export default GarageOwnerUsers;
