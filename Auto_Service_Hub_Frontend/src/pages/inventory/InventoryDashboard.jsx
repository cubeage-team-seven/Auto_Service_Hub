import React, { useEffect, useState } from "react";
import { partsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./InventoryDashboard.css";

function InventoryDashboard() {
  const [parts, setParts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([partsApi.list(), partsApi.lowStock()])
      .then(([allParts, lowParts]) => {
        setParts(allParts);
        setLowStock(lowParts);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const inventoryValue = parts.reduce(
    (total, part) => total + Number(part.purchasePrice || 0) * Number(part.stockQty || 0),
    0,
  );
  const outOfStock = parts.filter((part) => Number(part.stockQty || 0) === 0).length;

  return (
    <main className="api-data-page">
      <header className="api-data-header"><div><p>INVENTORY MANAGEMENT</p><h1>Inventory overview</h1></div></header>
      {error && <div className="api-data-error" role="alert">{error}</div>}
      {loading ? <p role="status">Loading inventory data…</p> : <>
        <section className="api-data-kpis">
          <article className="api-data-kpi"><span>TOTAL PARTS</span><strong>{parts.length}</strong></article>
          <article className="api-data-kpi"><span>LOW STOCK</span><strong>{lowStock.length}</strong></article>
          <article className="api-data-kpi"><span>OUT OF STOCK</span><strong>{outOfStock}</strong></article>
          <article className="api-data-kpi"><span>STOCK VALUE</span><strong>₹{inventoryValue.toLocaleString("en-IN")}</strong></article>
        </section>
        <section className="api-data-card">
          <h2>Parts requiring attention</h2>
          <div className="api-data-table-wrap"><table className="api-data-table">
            <thead><tr><th>SKU</th><th>Part</th><th>Available</th><th>Reorder at</th><th>Unit</th></tr></thead>
            <tbody>{lowStock.map((part) => <tr key={part.id}>
              <td>{part.sku}</td><td>{part.name}</td><td>{part.stockQty}</td><td>{part.minStock}</td><td>{part.unit || "—"}</td>
            </tr>)}</tbody>
          </table>{!lowStock.length && <p>No parts are currently below reorder level.</p>}</div>
        </section>
      </>}
    </main>
  );
}

export default InventoryDashboard;
