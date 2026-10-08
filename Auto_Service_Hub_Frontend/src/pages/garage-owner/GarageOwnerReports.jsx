import React, { useEffect, useState } from "react";
import { reportsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerReports.css";

const today = new Date().toISOString().slice(0, 10);
const monthStart = `${today.slice(0, 8)}01`;
const reportOptions = [
  ["dashboard", "Dashboard summary"],
  ["daily-workshop", "Daily workshop"],
  ["revenue", "Revenue and payments"],
  ["mechanic-performance", "Mechanic performance"],
  ["parts-usage", "Parts usage"],
  ["customer-growth", "Customer growth"],
  ["profit-analysis", "Profit analysis"],
  ["ai-insights", "AI insights"],
];

function GarageOwnerReports() {
  const [report, setReport] = useState("dashboard");
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(today);
  const [date, setDate] = useState(today);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const params = report === "dashboard"
        ? {}
        : report === "daily-workshop"
        ? { date }
        : { from, to };
      setData(await reportsApi.get(report, params));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReport(); }, [report]);

  return (
    <main className="api-data-page">
      <header className="api-data-header"><div><p>WORKSHOP ANALYTICS</p><h1>Reports</h1></div></header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      <section className="api-data-card">
        <form className="api-data-form" onSubmit={(event) => { event.preventDefault(); loadReport(); }}>
          <label>Report
            <select value={report} onChange={(event) => setReport(event.target.value)}>
              {reportOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {report === "daily-workshop"
            ? <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            : report !== "dashboard" && <>
              <label>From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
              <label>To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
            </>}
          <button disabled={loading}>{loading ? "Loading…" : "Run report"}</button>
        </form>
      </section>
      <section className="api-data-card">
        <h2>{reportOptions.find(([value]) => value === report)?.[1]}</h2>
        {loading ? <p role="status">Loading report…</p> : data && <pre className="api-report-output">{JSON.stringify(data, null, 2)}</pre>}
      </section>
    </main>
  );
}

export default GarageOwnerReports;
