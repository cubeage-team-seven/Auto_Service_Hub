import React, { useEffect, useMemo, useState } from "react";
import { partsApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerInventory.css";

function GarageOwnerInventory() {
  /* =====================================================
     INVENTORY DATA
  ===================================================== */

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    partsApi.list()
      .then(setInventory)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);


  /* =====================================================
     FILTER STATES
  ===================================================== */

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All Stock");


  /* =====================================================
     ADD PART MODAL
  ===================================================== */

  const [showAddPart, setShowAddPart] = useState(false);
  const [movementPart, setMovementPart] = useState(null);
  const [movementForm, setMovementForm] = useState({ movementType: "IN", quantity: "1", reason: "" });
  const [savingMovement, setSavingMovement] = useState(false);


  /* =====================================================
     ADD PART FORM
  ===================================================== */

  const [partForm, setPartForm] = useState({
    partName: "",
    sku: "",
    unit: "Piece",
    openingStock: "0",
    minimumQty: "0",
    unitPrice: "",
    sellingPrice: "",
  });


  /* =====================================================
     CATEGORIES
  ===================================================== */

  /* =====================================================
     FILTERED INVENTORY
  ===================================================== */

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const searchValue = search.toLowerCase().trim();

      const searchMatch =
        item.sku.toLowerCase().includes(searchValue) ||
        item.name.toLowerCase().includes(searchValue);

      let stockMatch = true;

      if (stockFilter === "Low Stock") {
        stockMatch = item.lowStock && item.stockQty > 0;
      }

      if (stockFilter === "Out of Stock") {
        stockMatch = item.stockQty === 0;
      }

      if (stockFilter === "In Stock") {
        stockMatch = !item.lowStock && item.stockQty > 0;
      }

      return searchMatch && stockMatch;
    });
  }, [inventory, search, stockFilter]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const lowStock = inventory.filter(
    (item) => item.lowStock && item.stockQty > 0
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.stockQty === 0
  ).length;


  /* =====================================================
     OPEN ADD PART
  ===================================================== */

  const openAddPart = () => {
    setShowAddPart(true);
  };


  /* =====================================================
     CLOSE ADD PART
  ===================================================== */

  const closeAddPart = () => {
    setShowAddPart(false);
  };


  /* =====================================================
     FORM INPUT CHANGE
  ===================================================== */

  const handlePartChange = (e) => {
    const { name, value } = e.target;

    setPartForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =====================================================
     ADD PART
  ===================================================== */

  const handleAddPart = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    try {
      const part = await partsApi.create({
        sku: partForm.sku.trim(),
        name: partForm.partName.trim(),
        unit: partForm.unit,
        stockQty: Number(partForm.openingStock),
        minStock: Number(partForm.minimumQty),
        purchasePrice: Number(partForm.unitPrice),
        sellingPrice: Number(partForm.sellingPrice),
      });
      setInventory((previous) => [...previous, part]);
      setShowAddPart(false);
      setPartForm({
        partName: "",
        sku: "",
        unit: "Piece",
        openingStock: "0",
        minimumQty: "0",
        unitPrice: "",
        sellingPrice: "",
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleStockMovement = async (e) => {
    e.preventDefault();
    setSavingMovement(true);
    setError("");
    try {
      await partsApi.stockMovement(movementPart.id, {
        movementType: movementForm.movementType,
        quantity: Number(movementForm.quantity),
        reason: movementForm.reason.trim() || null,
      });
      setInventory(await partsApi.list());
      setMovementPart(null);
      setMovementForm({ movementType: "IN", quantity: "1", reason: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingMovement(false);
    }
  };


  return (
    <div className="inventory-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="inventory-page-top">

        <div className="inventory-page-title">

          <div className="inventory-eyebrow">
            — INVENTORY MANAGEMENT
          </div>

          <h1>
            SPARE PARTS INVENTORY
          </h1>

          <p>
            Manage workshop parts and stock levels.
          </p>

        </div>


        {/* =================================================
            ADD PART BUTTON
        ================================================= */}

        <button
          type="button"
          className="inventory-add-button"
          onClick={openAddPart}
        >
          + ADD PART
        </button>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">

          <span>
            TOTAL SKUS
          </span>

          <strong>
            {inventory.length}
          </strong>

          <small>
            Active inventory items
          </small>

        </div>


        <div className="inventory-stat-card">

          <span>
            LOW STOCK
          </span>

          <strong className="lime">
            {lowStock}
          </strong>

          <small>
            Items need attention
          </small>

        </div>


        <div className="inventory-stat-card">

          <span>
            OUT OF STOCK
          </span>

          <strong>
            {outOfStock}
          </strong>

          <small>
            Parts currently unavailable
          </small>

        </div>


        <div className="inventory-stat-card">

          <span>
            INVENTORY VALUE
          </span>

          <strong>
            ₹{inventory.reduce(
              (total, item) =>
                total + Number(item.purchasePrice || 0) * Number(item.stockQty || 0),
              0,
            ).toLocaleString("en-IN")}
          </strong>

          <small>
            Current stock value
          </small>

        </div>

      </div>

      {error && <div className="api-data-error" role="alert">{error}</div>}
      {loading && <p role="status">Loading inventory...</p>}

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="inventory-filters">

        <div className="inventory-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by SKU or part name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={stockFilter}
          onChange={(e) =>
            setStockFilter(e.target.value)
          }
        >

          <option value="All Stock">
            All Stock
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

          <option value="Out of Stock">
            Out of Stock
          </option>

        </select>

      </div>


      {/* =====================================================
          INVENTORY TABLE
      ===================================================== */}

      <div className="inventory-table-card">

        <div className="inventory-table-heading">

          <strong>
            INVENTORY ITEMS
          </strong>

          <span>
            {filteredItems.length} ITEMS
          </span>

        </div>


        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>
                <th>SKU</th>
                <th>PART NAME</th>
                <th>UNIT</th>
                <th>STOCK</th>
                <th>MIN QTY</th>
                <th>PURCHASE PRICE</th>
                <th>SELLING PRICE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>

            </thead>


            <tbody>

              {filteredItems.length > 0 ? (

                filteredItems.map((item) => (

                  <tr key={item.id}>

                    <td className="inventory-sku">
                      {item.sku}
                    </td>

                    <td className="inventory-part-name">
                      {item.name}
                    </td>

                    <td>
                      {item.unit || "—"}
                    </td>

                    <td
                      className={
                        item.lowStock
                          ? "inventory-stock-low"
                          : "inventory-stock"
                      }
                    >
                      {item.stockQty}
                    </td>

                    <td>
                      {item.minStock}
                    </td>

                    <td className="inventory-price">
                      ₹{Number(item.purchasePrice || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹{Number(item.sellingPrice || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={
                          item.stockQty === 0 || item.lowStock
                            ? "inventory-status low"
                            : "inventory-status ok"
                        }
                      >
                        {item.stockQty === 0
                          ? "Out of Stock"
                          : item.lowStock
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="inventory-edit"
                        onClick={() => setMovementPart(item)}
                      >
                        Stock movement
                      </button>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="inventory-empty"
                  >
                    No inventory items found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          ADD PART MODAL
      ===================================================== */}

      {showAddPart && (

        <div
          className="inventory-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              closeAddPart();
            }

          }}
        >

          <div
            className="inventory-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="inventory-modal-header">

              <h2>
                ADD SPARE PART
              </h2>

              <button
                type="button"
                className="inventory-modal-close"
                onClick={closeAddPart}
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="inventory-add-form"
              onSubmit={handleAddPart}
            >


              {/* PART NAME + SKU */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    PART NAME
                  </label>

                  <input
                    type="text"
                    name="partName"
                    value={partForm.partName}
                    onChange={handlePartChange}
                    placeholder="Enter part name"
                    required
                  />

                </div>


                <div className="inventory-form-group">

                  <label>
                    SKU / PART NUMBER
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={partForm.sku}
                    onChange={handlePartChange}
                    placeholder="ENO-0001"
                    required
                  />

                </div>

              </div>


              {/* UNIT */}
              <div className="inventory-form-row">
                <div className="inventory-form-group">

                  <label>
                    UNIT
                  </label>

                  <select
                    name="unit"
                    value={partForm.unit}
                    onChange={handlePartChange}
                  >

                    <option>
                      Piece
                    </option>

                    <option>
                      Set
                    </option>

                    <option>
                      Litre
                    </option>

                    <option>
                      Kg
                    </option>

                  </select>

                </div>

              </div>


              {/* OPENING STOCK + MINIMUM QTY */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    OPENING STOCK QTY
                  </label>

                  <input
                    type="number"
                    name="openingStock"
                    min="0"
                    value={partForm.openingStock}
                    onChange={handlePartChange}
                  />

                </div>


                <div className="inventory-form-group">

                  <label>
                    MINIMUM QTY
                  </label>

                  <input
                    type="number"
                    name="minimumQty"
                    min="0"
                    value={partForm.minimumQty}
                    onChange={handlePartChange}
                  />

                </div>

              </div>


              {/* UNIT PRICE + SELLING PRICE */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    UNIT PRICE (₹)
                  </label>

                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    step="0.01"
                    value={partForm.unitPrice}
                    onChange={handlePartChange}
                    required
                  />

                </div>


                <div className="inventory-form-group">

                  <label>
                    SELLING PRICE (₹)
                  </label>

                  <input
                    type="number"
                    name="sellingPrice"
                    min="0"
                    step="0.01"
                    value={partForm.sellingPrice}
                    onChange={handlePartChange}
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  MODAL ACTIONS
              ================================================= */}

              <div className="inventory-modal-actions">

                <button
                  type="submit"
                  className="inventory-modal-add-button"
                  disabled={saving}
                >
                  {saving ? "SAVING..." : "ADD PART"}
                </button>

                <button
                  type="button"
                  className="inventory-modal-cancel-button"
                  onClick={closeAddPart}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {movementPart && (
        <div className="inventory-modal-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !savingMovement) setMovementPart(null);
        }}>
          <div className="inventory-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="inventory-modal-header">
              <h2>STOCK MOVEMENT — {movementPart.sku}</h2>
              <button type="button" className="inventory-modal-close" onClick={() => setMovementPart(null)} aria-label="Close">×</button>
            </div>
            <p>{movementPart.name} · current stock: {movementPart.stockQty}</p>
            <form className="inventory-add-form" onSubmit={handleStockMovement}>
              <div className="inventory-form-row">
                <div className="inventory-form-group">
                  <label>MOVEMENT</label>
                  <select value={movementForm.movementType} onChange={(e) => setMovementForm({ ...movementForm, movementType: e.target.value })}>
                    <option value="IN">Receive stock</option>
                    <option value="OUT">Remove stock</option>
                  </select>
                </div>
                <div className="inventory-form-group">
                  <label>QUANTITY</label>
                  <input type="number" min="1" step="1" required value={movementForm.quantity} onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })} />
                </div>
              </div>
              <div className="inventory-form-group full">
                <label>REASON (OPTIONAL)</label>
                <input value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} />
              </div>
              <div className="inventory-modal-actions">
                <button type="submit" className="inventory-modal-add-button" disabled={savingMovement}>{savingMovement ? "SAVING..." : "RECORD MOVEMENT"}</button>
                <button type="button" className="inventory-modal-cancel-button" onClick={() => setMovementPart(null)} disabled={savingMovement}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default GarageOwnerInventory;