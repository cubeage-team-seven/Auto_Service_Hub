import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/mechanic-dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <form onSubmit={handleSubmit} style={{ background: "#111", padding: "2.5rem", borderRadius: "12px", width: "360px", border: "1px solid #222" }}>
        <div style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem" }}>AUTO SERVICE HUB</div>
        <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: "2rem" }}>Sign in to continue</div>

        {error && <div style={{ color: "#f87171", marginBottom: "1rem", fontSize: "0.85rem" }}>{error}</div>}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "#888", fontSize: "0.75rem", display: "block", marginBottom: "0.4rem" }}>USERNAME</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            required
            style={{ width: "100%", padding: "0.65rem", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "#888", fontSize: "0.75rem", display: "block", marginBottom: "0.4rem" }}>PASSWORD</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            style={{ width: "100%", padding: "0.65rem", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "0.75rem", background: "#22c55e", border: "none", borderRadius: "6px", color: "#000", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
