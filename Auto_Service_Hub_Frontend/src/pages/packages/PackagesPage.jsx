import React, { useEffect, useState } from "react";
import { servicePackagesApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./PackagesPage.css";

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    servicePackagesApi.list()
      .then(setPackages)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const createPackage = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await servicePackagesApi.create({
        name: form.name.trim(),
        type: form.type.trim(),
        price: Number(form.price),
        active: true,
      });
      setPackages((current) => [created, ...current]);
      setForm({ name: "", type: "", price: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    setError("");
    try {
      const updated = await servicePackagesApi.update(item.id, {
        name: item.name,
        type: item.type,
        price: item.price,
        active: !item.active,
      });
      setPackages((current) => current.map((row) => row.id === updated.id ? updated : row));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <main className="api-data-page">
      <header className="api-data-header"><div><p>WORKSHOP OPERATIONS</p><h1>Service packages</h1></div></header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      <section className="api-data-card">
        <h2>Create a package</h2>
        <form className="api-data-form" onSubmit={createPackage}>
          <label>Package name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Type<input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. Maintenance" /></label>
          <label>Price<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
          <button disabled={saving}>{saving ? "Saving…" : "Add package"}</button>
        </form>
      </section>
      <section className="api-data-card">
        <h2>Available packages</h2>
        {loading ? <p role="status">Loading packages…</p> : (
          <div className="api-data-table-wrap"><table className="api-data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>{packages.map((item) => <tr key={item.id}>
              <td>{item.name}</td><td>{item.type}</td><td>₹{Number(item.price || 0).toLocaleString("en-IN")}</td>
              <td>{item.active ? "Active" : "Inactive"}</td>
              <td><button type="button" onClick={() => toggleActive(item)}>{item.active ? "Deactivate" : "Activate"}</button></td>
            </tr>)}</tbody>
          </table>{!packages.length && <p>No packages found.</p>}</div>
        )}
      </section>
    </main>
  );
}

export default PackagesPage;
