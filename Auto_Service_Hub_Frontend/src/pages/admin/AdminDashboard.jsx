import React, { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import { getUnlinkedMechanicProfiles } from "../../services/mechanicService";
import "./Admin.css";

const staffRoles = [
  ["OWNER", "Garage owner"],
  ["MANAGER", "Manager"],
  ["SERVICE_ADVISOR", "Service advisor"],
  ["MECHANIC", "Mechanic"],
  ["INVENTORY_MANAGER", "Inventory manager"],
  ["BILLING_USER", "Billing staff"],
];

const emptyForm = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  role: "OWNER",
  mechanicId: "",
  password: "",
};

const isMechanicRole = (role) =>
  String(role || "").trim().replace(/^ROLE_/i, "").toUpperCase() === "MECHANIC";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [mechanicProfiles, setMechanicProfiles] = useState([]);
  const [mechanicProfilesError, setMechanicProfilesError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [reviewCredentials, setReviewCredentials] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [requestRows, userRows] = await Promise.all([
        adminApi.accessRequests(),
        adminApi.users(),
      ]);
      setRequests(requestRows);
      setUsers(userRows);
      try {
        setMechanicProfiles(await getUnlinkedMechanicProfiles());
        setMechanicProfilesError("");
      } catch (profileError) {
        setMechanicProfiles([]);
        setMechanicProfilesError(
          getErrorMessage(profileError, "Could not load unlinked mechanic profiles.")
        );
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not load administrator data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const createUser = async (event) => {
    event.preventDefault();
    if (isMechanicRole(form.role) && !form.mechanicId) {
      setError("Select the mechanic profile for this account.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await adminApi.createUser({
        ...form,
        mechanicId: isMechanicRole(form.role) ? Number(form.mechanicId) : null,
      });
      setCredentials({ name: form.fullName || form.username, username: form.username, email: form.email, password: form.password });
      setForm(emptyForm);
      setMessage("Account created.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not create the account."));
    } finally {
      setSaving(false);
    }
  };

  const reviewRequest = async (request, approve) => {
    setSaving(true);
    setError("");
    setMessage("");
    const credentialsForRequest = reviewCredentials[request.id] || {};
    try {
      if (approve) {
        if (!credentialsForRequest.username || !credentialsForRequest.password) {
          setError("Enter a username and an initial password of at least 12 characters before approving.");
          return;
        }
        if (isMechanicRole(request.requestedRole) && !credentialsForRequest.mechanicId) {
          setError("Select the mechanic profile for this access request.");
          return;
        }
        await adminApi.approveAccessRequest(request.id, {
          username: credentialsForRequest.username,
          password: credentialsForRequest.password,
          role: request.requestedRole,
          mechanicId: isMechanicRole(request.requestedRole)
            ? Number(credentialsForRequest.mechanicId)
            : null,
        });
        setCredentials({
          name: request.name,
          username: credentialsForRequest.username,
          email: request.email,
          password: credentialsForRequest.password,
        });
        setReviewCredentials((current) => {
          const remaining = { ...current };
          delete remaining[request.id];
          return remaining;
        });
        setMessage("Request approved and account created.");
      } else {
        await adminApi.rejectAccessRequest(request.id, { note: "Not approved by administrator." });
        setReviewCredentials((current) => {
          const remaining = { ...current };
          delete remaining[request.id];
          return remaining;
        });
        setMessage("Request rejected.");
      }
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not review the access request."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-content">
      <div className="admin-page-heading">
        <div><p className="access-request-kicker">ACCOUNT GOVERNANCE</p><h1>Access &amp; staff</h1></div>
        <span>{users.length} account{users.length === 1 ? "" : "s"}</span>
      </div>
      {loading && <p>Loading administrator data…</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}
      {message && <p className="admin-success" role="status">{message}</p>}
      {credentials && (
        <section className="admin-credentials" role="status">
          <button type="button" onClick={() => setCredentials(null)} aria-label="Dismiss">×</button>
          <strong>Share these initial credentials securely. This password is shown only once.</strong>
          <p>{credentials.name} — {credentials.email}</p>
          <p>Username: <code>{credentials.username}</code></p>
          <p>Initial password: <code>{credentials.password}</code></p>
        </section>
      )}

      <section className="admin-panel">
        <h2>Owner and staff access requests</h2>
        {requests.filter((request) => request.status === "PENDING").length === 0
          ? <p>No requests awaiting review.</p>
          : requests.filter((request) => request.status === "PENDING").map((request) => {
            const values = reviewCredentials[request.id] || {
              username: request.email,
              password: "",
              mechanicId: "",
            };
            const update = (field, value) => setReviewCredentials((current) => ({
              ...current,
              [request.id]: { ...values, [field]: value },
            }));
            return (
              <article className="admin-request-row" key={request.id}>
                <div><strong>{request.name}</strong><span>{request.email} · {request.phone || "No phone"}</span>
                  <span>{request.requestedRole.replaceAll("_", " ")} · {request.message || "No message"}</span></div>
                <label>Username<input required value={values.username} onChange={(event) => update("username", event.target.value)} /></label>
                <label>Initial password<input type="password" minLength="12" maxLength="72" autoComplete="new-password" value={values.password} onChange={(event) => update("password", event.target.value)} /></label>
                {isMechanicRole(request.requestedRole) && (
                  <label>
                    Mechanic profile
                    <select
                      value={values.mechanicId}
                      onChange={(event) => update("mechanicId", event.target.value)}
                      required
                    >
                      <option value="">
                        {mechanicProfiles.length > 0
                          ? "Select an unlinked mechanic profile"
                          : "No unlinked mechanic profiles available"}
                      </option>
                      {mechanicProfiles.map((profile) => (
                        <option value={profile.id} key={profile.id}>
                          {profile.employeeCode || `#${profile.id}`} — {profile.name}
                          {profile.status ? ` (${profile.status})` : ""}
                        </option>
                      ))}
                    </select>
                    {mechanicProfilesError && <span className="admin-error">{mechanicProfilesError}</span>}
                  </label>
                )}
                <div className="admin-actions">
                  <button type="button" className="admin-primary-button" disabled={saving} onClick={() => void reviewRequest(request, true)}>Approve</button>
                  <button type="button" className="admin-secondary-button" disabled={saving} onClick={() => void reviewRequest(request, false)}>Reject</button>
                </div>
              </article>
            );
          })}
      </section>

      <section className="admin-panel">
        <h2>Create owner or staff account</h2>
        <p>Only administrators can create privileged accounts. Admin accounts are established through the secure one-time bootstrap.</p>
        <form className="admin-form-grid" onSubmit={createUser}>
          <label>Full name<input required maxLength="150" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label>
          <label>Username<input required minLength="3" maxLength="100" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>
          <label>Email<input required type="email" maxLength="150" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Phone<input maxLength="30" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
          <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value, mechanicId: "" })}>{staffRoles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {isMechanicRole(form.role) && (
            <label>
              Mechanic profile
              <select
                required
                value={form.mechanicId}
                onChange={(event) => setForm({ ...form, mechanicId: event.target.value })}
              >
                <option value="">
                  {mechanicProfiles.length > 0
                    ? "Select an unlinked mechanic profile"
                    : "No unlinked mechanic profiles available"}
                </option>
                {mechanicProfiles.map((profile) => (
                  <option value={profile.id} key={profile.id}>
                    {profile.employeeCode || `#${profile.id}`} — {profile.name}
                    {profile.status ? ` (${profile.status})` : ""}
                  </option>
                ))}
              </select>
              {mechanicProfilesError && <span className="admin-error">{mechanicProfilesError}</span>}
            </label>
          )}
          <label>Initial password<input required type="password" minLength="12" maxLength="72" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? "Creating…" : "Create account"}</button>
        </form>
      </section>

      <section className="admin-panel">
        <h2>Accounts</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Username</th><th>Name / email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id}><td>{user.username}</td><td>{user.email}</td><td>{user.role}</td><td>{user.active ? "Active" : "Inactive"}</td></tr>)}</tbody>
        </table></div>
      </section>
    </main>
  );
}
