import React, { useCallback, useEffect, useState } from "react";
import {
  createPart,
  createSupplier,
  getParts,
  getSuppliers,
} from "../../services/inventoryService";
import "./InventoryPage.css";

const PART_CATEGORIES = [
  "Lubricants",
  "Brakes",
  "Filters",
  "Ignition",
  "Tyres",
  "Electrical",
  "Engine Parts",
  "Suspension",
  "Other",
];

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

function toInventoryRow(part) {
  const stock = Number(part.stockQty ?? 0);
  const min = Number(part.minStock ?? 0);

  return {
    id: part.id,
    sku: part.sku ?? "",
    name: part.name ?? "",
    category: part.category ?? "Uncategorised",
    location: part.storageLocation ?? "—",
    stock,
    min,
    price: part.purchasePrice == null ? "—" : formatPrice(part.purchasePrice),
    supplier: part.supplierName ?? "Not Assigned",
    status:
      stock === 0
        ? "Out of Stock"
        : stock <= min
        ? "Low Stock"
        : "OK",
  };
}

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stock, setStock] = useState("All Stock");
  /* =====================================================
     ADD PART MODAL
  ===================================================== */

  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [createError, setCreateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [partForm, setPartForm] = useState({
    partName: "",
    sku: "",
    category: "Lubricants",
    unit: "Piece",
    openingStock: "",
    minimumQty: "",
    unitPrice: "",
    sellingPrice: "",
    supplier: "",
    storageLocation: "",
    hsnCode: "",
  });

  /* =====================================================
     INVENTORY DATA
  ===================================================== */

  const [inventory, setInventory] = useState([]);

  const loadInventory = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setLoadError("");

    try {
      const parts = await getParts();
      setInventory(parts.map(toInventoryRow));
      const supplierList = await getSuppliers();
      setSuppliers(supplierList);
      return true;
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load inventory."
      );
      return false;
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  /* =====================================================
     FILTERED INVENTORY
  ===================================================== */

  const filteredInventory = inventory.filter((item) => {
    const searchMatch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "All Categories" ||
      item.category === category;

    const stockMatch =
      stock === "All Stock" ||
      (stock === "In Stock" && item.status === "OK") ||
      (stock === "Low Stock" && item.status === "Low Stock") ||
      (stock === "Out of Stock" && item.stock === 0);

    return searchMatch && categoryMatch && stockMatch;
  });

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handlePartFormChange = async (e) => {
    const { name, value } = e.target;
    setCreateError("");

    if (name === "supplier" && value === "Add New Supplier...") {
      const newSupplier = window.prompt("Enter new supplier name:");
      if (newSupplier && newSupplier.trim()) {
        const trimmed = newSupplier.trim();
        try {
          const createdSupplier = await createSupplier({ name: trimmed });
          setSuppliers((previous) => [...previous, createdSupplier]);
          setPartForm((previous) => ({
            ...previous,
            supplier: String(createdSupplier.id),
          }));
        } catch (error) {
          setCreateError(
            error instanceof Error
              ? error.message
              : "Unable to add the supplier."
          );
          setPartForm((previous) => ({
            ...previous,
            supplier: "",
          }));
        }
      } else {
        setPartForm((previous) => ({
          ...previous,
          supplier: "",
        }));
      }
      return;
    }

    setPartForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN MODAL
  ===================================================== */

  const openAddPartModal = () => {
    setCreateError("");
    setSuccessMessage("");
    setPartForm({
      partName: "",
      sku: "",
      category: "Lubricants",
      unit: "Piece",
      openingStock: "",
      minimumQty: "",
      unitPrice: "",
      sellingPrice: "",
      supplier: "",
      storageLocation: "",
      hsnCode: "",
    });

    setShowAddPartModal(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeAddPartModal = () => {
    if (isCreating) {
      return;
    }
    setShowAddPartModal(false);
    setCreateError("");
  };

  /* =====================================================
     ADD PART
  ===================================================== */

  const handleAddPart = async (e) => {
    e.preventDefault();

    if (isCreating) {
      return;
    }

    if (!partForm.partName.trim()) {
      setCreateError("Please enter part name.");
      return;
    }

    if (!partForm.sku.trim()) {
      setCreateError("Please enter SKU / Part Number.");
      return;
    }

    if (partForm.openingStock === "") {
      setCreateError("Please enter opening stock quantity.");
      return;
    }

    if (partForm.minimumQty === "") {
      setCreateError("Please enter minimum quantity.");
      return;
    }

    if (partForm.unitPrice === "") {
      setCreateError("Please enter unit price.");
      return;
    }

    if (partForm.sellingPrice === "") {
      setCreateError("Please enter selling price.");
      return;
    }

    if (!partForm.supplier || partForm.supplier === "Add New Supplier...") {
      setCreateError("Please select a supplier.");
      return;
    }

    if (!partForm.storageLocation.trim()) {
      setCreateError("Please enter storage location.");
      return;
    }

    if (!partForm.hsnCode.trim()) {
      setCreateError("Please enter HSN code.");
      return;
    }

    const duplicateSKU = inventory.some(
      (item) =>
        item.sku.toLowerCase() ===
        partForm.sku.trim().toLowerCase()
    );

    if (duplicateSKU) {
      setCreateError("This SKU already exists.");
      return;
    }

    const supplierId = Number(partForm.supplier);
    if (!Number.isInteger(supplierId) || supplierId <= 0) {
      setCreateError("Please select a valid supplier.");
      return;
    }

    setIsCreating(true);
    setCreateError("");
    setSuccessMessage("");

    try {
      const savedPart = await createPart({
        sku: partForm.sku.trim().toUpperCase(),
        name: partForm.partName.trim(),
        unit: partForm.unit,
        stockQty: Number(partForm.openingStock),
        minStock: Number(partForm.minimumQty),
        purchasePrice: Number(partForm.unitPrice),
        sellingPrice: Number(partForm.sellingPrice),
        category: partForm.category,
        supplierId,
        storageLocation: partForm.storageLocation.trim(),
        hsnCode: partForm.hsnCode.trim(),
      });

      const savedRow = toInventoryRow(savedPart);
      setInventory((previous) => [
        savedRow,
        ...previous.filter(
          (item) =>
            item.id !== savedRow.id &&
            item.sku.toLowerCase() !== savedRow.sku.toLowerCase()
        ),
      ]);
      setShowAddPartModal(false);
      setPartForm({
        partName: "",
        sku: "",
        category: "Lubricants",
        unit: "Piece",
        openingStock: "",
        minimumQty: "",
        unitPrice: "",
        sellingPrice: "",
        supplier: "",
        storageLocation: "",
        hsnCode: "",
      });
      setSearch("");
      setCategory("All Categories");
      setStock("All Stock");
      setSuccessMessage(
        `${savedPart.name || partForm.partName.trim()} (${savedPart.sku || partForm.sku.trim()}) added successfully.`
      );
      await loadInventory({ showLoading: false });
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Unable to add the part."
      );
    } finally {
      setIsCreating(false);
    }
  };

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalSKUs = inventory.length;

  const lowStockCount = inventory.filter(
    (item) =>
      item.stock > 0 &&
      item.stock <= item.min
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.stock === 0
  ).length;

  const inventoryValue = inventory.reduce(
    (total, item) => {
      const numericPrice =
        Number(
          String(item.price)
            .replace("₹", "")
            .replace(/,/g, "")
        ) || 0;

      return (
        total +
        numericPrice * item.stock
      );
    },
    0
  );

  const formattedInventoryValue =
    inventoryValue >= 100000
      ? `₹${(
          inventoryValue / 100000
        ).toFixed(1)}L`
      : `₹${inventoryValue.toLocaleString(
          "en-IN"
        )}`;

  return (
    <>
      <section className="inventory-content">


          <div className="inventory-heading">

            <div>

              <div className="inventory-date">
                — INVENTORY MANAGEMENT
              </div>

              <h1>
                SPARE PARTS INVENTORY
              </h1>

              <p>
                Manage parts, stock levels, suppliers and procurement.
              </p>

            </div>


            <button
              type="button"
              className="inventory-add-button"
              onClick={openAddPartModal}
              disabled={isLoading}
            >
              + ADD PART
            </button>

          </div>

          {loadError && (
            <p className="inventory-feedback inventory-feedback-error" role="alert">
              {loadError}
            </p>
          )}
          {successMessage && (
            <p className="inventory-feedback inventory-feedback-success" role="status">
              {successMessage}
            </p>
          )}


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="inventory-stat-grid">

            <StatCard
              title="TOTAL SKUS"
              value={totalSKUs}
              text="Active inventory items"
            />

            <StatCard
              title="LOW STOCK"
              value={lowStockCount}
              text="Items need attention"
              green
            />

            <StatCard
              title="OUT OF STOCK"
              value={outOfStockCount}
              text={
                outOfStockCount === 0
                  ? "No unavailable parts"
                  : "Unavailable parts"
              }
            />

            <StatCard
              title="INVENTORY VALUE"
              value={formattedInventoryValue}
              text="Current stock value"
            />

          </div>


          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className="inventory-filter-bar">

            <div className="inventory-search-wrapper">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by SKU, name, category..."
              />

            </div>


            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option>
                All Categories
              </option>

              {PART_CATEGORIES.map((partCategory) => (
                <option key={partCategory}>{partCategory}</option>
              ))}

            </select>


            <select
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
            >

              <option>
                All Stock
              </option>

              <option>
                In Stock
              </option>

              <option>
                Low Stock
              </option>

              <option>
                Out of Stock
              </option>

            </select>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div className="inventory-table-panel">

            <div className="inventory-table-header">

              <span>
                INVENTORY ITEMS
              </span>

              <span>
                {filteredInventory.length} ITEMS
              </span>

            </div>


            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>

                  <tr>

                    <th>SKU</th>

                    <th>PART NAME</th>

                    <th>CATEGORY</th>

                    <th>LOCATION</th>

                    <th>STOCK</th>

                    <th>MIN QTY</th>

                    <th>UNIT PRICE</th>

                    <th>SUPPLIER</th>

                    <th>STATUS</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredInventory.map(
                    (item) => (
                      <InventoryRow
                        key={item.id ?? item.sku}
                        {...item}
                      />
                    )
                  )}


                  {isLoading && (
                    <tr>
                      <td colSpan="9" className="inventory-empty">
                        Loading inventory...
                      </td>
                    </tr>
                  )}

                  {!isLoading && filteredInventory.length ===
                    0 && (

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

        </section>


      {/* =====================================================
          ADD SPARE PART MODAL
      ===================================================== */}

      {showAddPartModal && (

        <div
          className="inventory-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              closeAddPartModal();
            }

          }}
        >

          <div className="inventory-add-modal">

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
                onClick={closeAddPartModal}
              >
                ×
              </button>

            </div>


            {/* =================================================
                MODAL FORM
            ================================================= */}

            <form
              className="inventory-add-form"
              onSubmit={handleAddPart}
            >

              <div className="inventory-modal-body">

              {/* PART NAME */}

              <div className="inventory-form-field full">

                <label>
                  PART NAME
                </label>

                <input
                  type="text"
                  name="partName"
                  value={partForm.partName}
                  onChange={handlePartFormChange}
                  placeholder="Engine Oil 5W-30 (1L)"
                />

              </div>


              {/* SKU */}

              <div className="inventory-form-field full">

                <label>
                  SKU / PART NUMBER
                </label>

                <input
                  type="text"
                  name="sku"
                  value={partForm.sku}
                  onChange={handlePartFormChange}
                  placeholder="ENO-0001"
                />

              </div>


              {/* CATEGORY + UNIT */}

              <div className="inventory-form-two">

                <div className="inventory-form-field">

                  <label>
                    CATEGORY
                  </label>

                  <select
                    name="category"
                    value={partForm.category}
                    onChange={handlePartFormChange}
                  >

                    {PART_CATEGORIES.map((partCategory) => (
                      <option key={partCategory}>{partCategory}</option>
                    ))}

                  </select>

                </div>


                <div className="inventory-form-field">

                  <label>
                    UNIT
                  </label>

                  <select
                    name="unit"
                    value={partForm.unit}
                    onChange={handlePartFormChange}
                  >

                    <option>
                      Piece
                    </option>

                    <option>
                      Set
                    </option>

                    <option>
                      Pair
                    </option>

                    <option>
                      Litre
                    </option>

                    <option>
                      Kg
                    </option>

                    <option>
                      Box
                    </option>

                  </select>

                </div>

              </div>


              {/* OPENING STOCK + MINIMUM */}

              <div className="inventory-form-two">

                <div className="inventory-form-field">

                  <label>
                    OPENING STOCK QTY
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="openingStock"
                    value={partForm.openingStock}
                    onChange={handlePartFormChange}
                    placeholder="10"
                  />

                </div>


                <div className="inventory-form-field">

                  <label>
                    MINIMUM QTY ALERT
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="minimumQty"
                    value={partForm.minimumQty}
                    onChange={handlePartFormChange}
                    placeholder="5"
                  />

                </div>

              </div>


              {/* UNIT PRICE + SELLING PRICE */}

              <div className="inventory-form-two">

                <div className="inventory-form-field">

                  <label>
                    UNIT PRICE (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="unitPrice"
                    value={partForm.unitPrice}
                    onChange={handlePartFormChange}
                    placeholder="320"
                  />

                </div>


                <div className="inventory-form-field">

                  <label>
                    SELLING PRICE (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="sellingPrice"
                    value={partForm.sellingPrice}
                    onChange={handlePartFormChange}
                    placeholder="380"
                  />

                </div>

              </div>


              {/* SUPPLIER */}

              <div className="inventory-form-field full">

                <label>
                  SUPPLIER
                </label>

                <select
                  name="supplier"
                  value={partForm.supplier}
                  onChange={handlePartFormChange}
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                  <option value="Add New Supplier...">Add New Supplier...</option>
                </select>

              </div>


              {/* STORAGE LOCATION */}

              <div className="inventory-form-field full">

                <label>
                  STORAGE LOCATION
                </label>

                <input
                  type="text"
                  name="storageLocation"
                  value={
                    partForm.storageLocation
                  }
                  onChange={
                    handlePartFormChange
                  }
                  placeholder="Rack A1, Shelf 2"
                />

              </div>


              {/* HSN CODE */}

              <div className="inventory-form-field full">

                <label>
                  HSN CODE (FOR GST)
                </label>

                <input
                  type="text"
                  name="hsnCode"
                  value={partForm.hsnCode}
                  onChange={handlePartFormChange}
                  placeholder="27101990"
                />

              </div>


              {/* DIVIDER + BUTTONS */}

              {createError && (
                <p className="inventory-feedback inventory-feedback-error" role="alert">
                  {createError}
                </p>
              )}

              </div>

              <div className="inventory-modal-actions">

                <button
                  type="submit"
                  className="inventory-save-button"
                  disabled={isCreating}
                >
                  {isCreating ? "SAVING..." : "ADD PART"}
                </button>

                <button
                  type="button"
                  className="inventory-cancel-button"
                  onClick={closeAddPartModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  text,
  green = false,
}) {
  return (
    <div className="inventory-stat-card">

      <div className="inventory-stat-label">
        {title}
      </div>

      <div
        className={`inventory-stat-value ${
          green ? "green" : ""
        }`}
      >
        {value}
      </div>

      <div className="inventory-stat-text">
        {text}
      </div>

    </div>
  );
}


/* =========================================================
   INVENTORY ROW
========================================================= */

function InventoryRow({
  sku,
  name,
  category,
  location,
  stock,
  min,
  price,
  supplier,
  status,
}) {
  const lowStock =
    status === "Low Stock";

  const outOfStock =
    status === "Out of Stock";

  return (
    <tr>

      <td className="inventory-sku">
        {sku}
      </td>

      <td className="inventory-part-name">
        {name}
      </td>

      <td>
        {category}
      </td>

      <td>
        {location}
      </td>

      <td
        className={
          lowStock || outOfStock
            ? "inventory-stock low"
            : "inventory-stock"
        }
      >
        {stock}
      </td>

      <td>
        {min}
      </td>

      <td className="inventory-price">
        {price}
      </td>

      <td>
        {supplier}
      </td>

      <td>

        <span
          className={`inventory-status ${
            lowStock || outOfStock
              ? "low"
              : "ok"
          }`}
        >
          {status}
        </span>

      </td>

    </tr>
  );
}


export default InventoryPage;