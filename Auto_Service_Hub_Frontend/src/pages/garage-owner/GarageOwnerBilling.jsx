import React, { useEffect, useMemo, useState } from "react";
import { estimatesApi, invoicesApi, jobCardsApi, paymentsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerBilling.css";

const initialInvoiceForm = { jobCardId: "", description: "", quantity: "1", unitPrice: "", discount: "0" };

function GarageOwnerBilling() {
  const [invoices, setInvoices] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [documentType, setDocumentType] = useState("ESTIMATE");
  const [jobCards, setJobCards] = useState([]);
  const [form, setForm] = useState(initialInvoiceForm);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [payment, setPayment] = useState({ amount: "", mode: "UPI" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshBilling = async () => {
    const [invoiceRows, estimateRows] = await Promise.all([invoicesApi.list(), estimatesApi.list()]);
    setInvoices(invoiceRows);
    setEstimates(estimateRows);
  };

  useEffect(() => {
    Promise.all([invoicesApi.list(), jobCardsApi.list(), estimatesApi.list()])
      .then(([invoiceRows, jobRows, estimateRows]) => {
        setInvoices(invoiceRows);
        setJobCards(jobRows);
        setEstimates(estimateRows);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const pendingAmount = useMemo(
    () => invoices.reduce((sum, invoice) => sum + Number(invoice.outstandingAmount || 0), 0),
    [invoices],
  );
  const paidThisMonth = useMemo(() => {
    const now = new Date();
    return invoices
      .filter((invoice) => {
        const date = invoice.invoiceDate ? new Date(invoice.invoiceDate) : null;
        return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, invoice) => sum + Number(invoice.amountPaid || 0), 0);
  }, [invoices]);

  const createInvoice = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        jobCardId: Number(form.jobCardId),
        discount: Number(form.discount || 0),
        items: [{
          description: form.description.trim(),
          quantity: Number(form.quantity),
          unitPrice: Number(form.unitPrice),
          category: "PART",
        }],
      };
      if (documentType === "ESTIMATE") {
        await estimatesApi.create(payload);
      } else {
        await invoicesApi.create({
          ...payload,
          status: "PENDING",
          invoiceDate: new Date().toISOString().slice(0, 10),
        });
      }
      await refreshBilling();
      setForm(initialInvoiceForm);
      setNotice(`${documentType === "ESTIMATE" ? "Estimate" : "Invoice"} created.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const openPayment = (invoice) => {
    setPayingInvoice(invoice);
    setPayment({ amount: String(invoice.outstandingAmount || ""), mode: "UPI" });
  };

  const recordPayment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await paymentsApi.create({
        invoiceId: payingInvoice.id,
        amount: Number(payment.amount),
        mode: payment.mode,
      });
      await refreshBilling();
      setPayingInvoice(null);
      setNotice("Payment recorded.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const acceptEstimate = async (estimate) => {
    setError("");
    try {
      const updated = await estimatesApi.update(estimate.id, {
        jobCardId: estimate.jobCardId,
        discount: estimate.discount,
        status: "ACCEPTED",
        items: (estimate.items || []).map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          category: item.category,
        })),
      });
      setEstimates((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const convertEstimate = async (estimate) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await estimatesApi.convert(estimate.id);
      await refreshBilling();
      setNotice(`Estimate #${estimate.id} converted to an invoice.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="api-data-page">
      <header className="api-data-header"><div><p>WORKSHOP OPERATIONS</p><h1>Billing and payments</h1></div></header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      {notice && <div className="api-data-notice" role="status">{notice}</div>}
      <section className="billing-stats">
        <div className="billing-stat"><span>PAYMENTS THIS MONTH</span><strong>₹{paidThisMonth.toLocaleString("en-IN")}</strong></div>
        <div className="billing-stat"><span>OUTSTANDING</span><strong>₹{pendingAmount.toLocaleString("en-IN")}</strong></div>
        <div className="billing-stat"><span>INVOICES</span><strong>{invoices.length}</strong></div>
      </section>
      <section className="api-data-card">
        <h2>Create estimate or invoice from job card</h2>
        <form className="api-data-form" onSubmit={createInvoice}>
          <label>Document type<select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            <option value="ESTIMATE">Estimate</option><option value="INVOICE">Invoice</option>
          </select></label>
          <label>Job card
            <select required value={form.jobCardId} onChange={(e) => setForm({ ...form, jobCardId: e.target.value })}>
              <option value="">Select job card</option>
              {jobCards.map((job) => <option key={job.id} value={job.id}>{job.jobCardNumber} — {job.customerName}</option>)}
            </select>
          </label>
          <label>Line description<input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Quantity<input type="number" required min="1" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          <label>Unit price<input type="number" required min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} /></label>
          <label>Discount<input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></label>
          <button disabled={saving}>{saving ? "Saving…" : "Create invoice"}</button>
        </form>
      </section>
      <section className="api-data-card">
        <h2>Estimates</h2>
        {loading ? <p role="status">Loading estimates…</p> : (
          <div className="api-data-table-wrap"><table className="api-data-table">
            <thead><tr><th>Estimate</th><th>Job card</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{estimates.map((estimate) => <tr key={estimate.id}>
              <td>#{estimate.id}</td><td>{estimate.jobCardNumber || `Job #${estimate.jobCardId}`}</td>
              <td>{estimate.items?.map((item) => item.description).join(", ") || "—"}</td>
              <td>₹{Number(estimate.total || 0).toLocaleString("en-IN")}</td><td>{estimate.status}</td>
              <td>{estimate.status === "DRAFT" && <button type="button" onClick={() => acceptEstimate(estimate)}>Mark accepted</button>}
                {estimate.status === "ACCEPTED" && <button type="button" disabled={saving} onClick={() => convertEstimate(estimate)}>Convert to invoice</button>}
              </td>
            </tr>)}</tbody>
          </table>{!estimates.length && <p>No estimates found.</p>}</div>
        )}
      </section>
      <section className="api-data-card">
        <h2>Invoices</h2>
        {loading ? <p role="status">Loading invoices…</p> : (
          <div className="api-data-table-wrap"><table className="api-data-table">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Vehicle</th><th>Date</th><th>Subtotal</th><th>GST</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th></th></tr></thead>
            <tbody>{invoices.map((invoice) => <tr key={invoice.id}>
              <td>#{invoice.id}</td><td>{invoice.customerName || "—"}</td><td>{invoice.vehicleInfo || "—"}</td>
              <td>{invoice.invoiceDate || "—"}</td><td>₹{Number(invoice.subtotal || 0).toLocaleString("en-IN")}</td>
              <td>₹{Number(invoice.gst || 0).toLocaleString("en-IN")}</td><td>₹{Number(invoice.total || 0).toLocaleString("en-IN")}</td>
              <td>₹{Number(invoice.amountPaid || 0).toLocaleString("en-IN")}</td>
              <td>₹{Number(invoice.outstandingAmount || 0).toLocaleString("en-IN")}</td><td>{invoice.status}</td>
              <td>{Number(invoice.outstandingAmount || 0) > 0 && invoice.status !== "CANCELLED" && <button type="button" onClick={() => openPayment(invoice)}>Record payment</button>}</td>
            </tr>)}</tbody>
          </table>{!invoices.length && <p>No invoices found.</p>}</div>
        )}
      </section>
      {payingInvoice && <div className="api-data-modal" role="presentation">
        <form className="api-data-card api-data-payment-form" onSubmit={recordPayment}>
          <h2>Record payment for invoice #{payingInvoice.id}</h2>
          <p>Outstanding: ₹{Number(payingInvoice.outstandingAmount || 0).toLocaleString("en-IN")}</p>
          <label>Amount<input type="number" required min="0.01" max={payingInvoice.outstandingAmount} step="0.01" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} /></label>
          <label>Payment mode<select value={payment.mode} onChange={(e) => setPayment({ ...payment, mode: e.target.value })}>
            <option>UPI</option><option>CASH</option><option>CARD</option><option>BANK_TRANSFER</option>
          </select></label>
          <div className="api-data-modal-actions"><button disabled={saving}>{saving ? "Saving…" : "Save payment"}</button><button type="button" onClick={() => setPayingInvoice(null)}>Cancel</button></div>
        </form>
      </div>}
    </main>
  );
}

export default GarageOwnerBilling;
