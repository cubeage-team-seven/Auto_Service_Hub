import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./InventoryPage.css";

function InventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================================================
     SIDEBAR / FILTER / MODAL
  ========================================================= */

  // Start CLOSED to match Figma
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stock, setStock] = useState("All Stock");

  const [showAddModal, setShowAddModal] = useState(false);

  /* =========================================================
     DEFAULT INVENTORY
  ========================================================= */

  const defaultInventory = [
    {
      sku: "ENO-7742",
      name: "Engine Oil 5W-30 (1L)",
      category: "Lubricants",
      location: "Rack A1",
      stock: 48,
      min: 20,
      price: "₹320",
      supplier: "Castrol India",
      status: "OK",
    },
    {
      sku: "BRP-2211",
      name: "Brake Pads — Front (Pair)",
      category: "Brakes",
      location: "Rack B3",
      stock: 12,
      min: 8,
      price: "₹1,200",
      supplier: "Bosch India",
      status: "OK",
    },
    {
      sku: "ACF-5503",
      name: "AC Filter",
      category: "Filters",
      location: "Rack C2",
      stock: 3,
      min: 5,
      price: "₹450",
      supplier: "Mahle Filters",
      status: "Low Stock",
    },
    {
      sku: "ATF-9902",
      name: "ATF Oil (1L)",
      category: "Lubricants",
      location: "Rack A2",
      stock: 18,
      min: 10,
      price: "₹580",
      supplier: "Shell India",
      status: "OK",
    },
    {
      sku: "SPK-1144",
      name: "Spark Plugs (Set of 4)",
      category: "Ignition",
      location: "Rack D1",
      stock: 22,
      min: 8,
      price: "₹880",
      supplier: "NGK India",
      status: "OK",
    },
    {
      sku: "TYR-3389",
      name: "Tyre 195/65 R15",
      category: "Tyres",
      location: "Bay Store",
      stock: 4,
      min: 4,
      price: "₹4,800",
      supplier: "MRF Ltd",
      status: "Low Stock",
    },
    {
      sku: "BAT-6670",
      name: "Battery 60Ah",
      category: "Electrical",
      location: "Rack E1",
      stock: 7,
      min: 3,
      price: "₹6,200",
      supplier: "Amaron India",
      status: "OK",
    },
    {
      sku: "OIF-3301",
      name: "Oil Filter",
      category: "Filters",
      location: "Rack C1",
      stock: 2,
      min: 10,
      price: "₹180",
      supplier: "Mann Filters",
      status: "Low Stock",
    },
  ];

  /* =========================================================
     LOAD INVENTORY FROM LOCAL STORAGE
  ========================================================= */

  const [inventory, setInventory] = useState(() => {
    try {
      const savedInventory =
        localStorage.getItem("smartgarage_inventory");

      if (savedInventory) {
        return JSON.parse(savedInventory);
      }
    } catch (error) {
      console.error(
        "Error loading inventory:",
        error
      );
    }

    return defaultInventory;
  });

  /* =========================================================
     SAVE INVENTORY
  ========================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "smartgarage_inventory",
        JSON.stringify(inventory)
      );
    } catch (error) {
      console.error(
        "Error saving inventory:",
        error
      );
    }
  }, [inventory]);

  /* =========================================================
     ADD PART FORM
  ========================================================= */

  const emptyForm = {
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
  };

  const [formData, setFormData] =
    useState(emptyForm);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     OPEN ADD PART
  ========================================================= */

  const openAddModal = () => {
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  /* =========================================================
     CLOSE ADD PART
  ========================================================= */

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData(emptyForm);
  };

  /* =========================================================
     ADD PART
  ========================================================= */

  const handleAddPart = (e) => {
    e.preventDefault();

    const partName =
      formData.partName.trim();

    const sku =
      formData.sku.trim();

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!partName) {
      alert("Please enter Part Name.");
      return;
    }

    if (!sku) {
      alert(
        "Please enter SKU / Part Number."
      );
      return;
    }

    if (formData.openingStock === "") {
      alert(
        "Please enter Opening Stock Qty."
      );
      return;
    }

    if (formData.minimumQty === "") {
      alert(
        "Please enter Minimum Qty Alert."
      );
      return;
    }

    if (formData.unitPrice === "") {
      alert(
        "Please enter Unit Price."
      );
      return;
    }

    if (!formData.supplier) {
      alert(
        "Please select a supplier."
      );
      return;
    }

    /* -----------------------------------------
       DUPLICATE SKU CHECK
    ----------------------------------------- */

    const duplicateSku =
      inventory.some(
        (item) =>
          item.sku.toLowerCase() ===
          sku.toLowerCase()
      );

    if (duplicateSku) {
      alert(
        "This SKU already exists in inventory."
      );
      return;
    }

    /* -----------------------------------------
       NUMBERS
    ----------------------------------------- */

    const stockQty =
      Number(formData.openingStock);

    const minimumQty =
      Number(formData.minimumQty);

    const unitPrice =
      Number(formData.unitPrice);

    /* -----------------------------------------
       STATUS
    ----------------------------------------- */

    let status = "OK";

    if (stockQty === 0) {
      status = "Out of Stock";
    } else if (
      stockQty <= minimumQty
    ) {
      status = "Low Stock";
    }

    /* -----------------------------------------
       NEW PART
    ----------------------------------------- */

    const newPart = {
      sku: sku,

      name: partName,

      category:
        formData.category,

      location:
        formData.storageLocation.trim() ||
        "Not Assigned",

      stock: stockQty,

      min: minimumQty,

      price:
        `₹${unitPrice.toLocaleString(
          "en-IN"
        )}`,

      supplier:
        formData.supplier,

      status: status,

      unit:
        formData.unit,

      sellingPrice:
        formData.sellingPrice,

      hsnCode:
        formData.hsnCode,
    };

    /* -----------------------------------------
       ADD TO INVENTORY
    ----------------------------------------- */

    setInventory((previous) => [
      ...previous,
      newPart,
    ]);

    /* -----------------------------------------
       CLOSE MODAL
    ----------------------------------------- */

    closeAddModal();

    alert(
      "Spare part added successfully!"
    );
  };

  /* =========================================================
     FILTER INVENTORY
  ========================================================= */

  const filteredInventory =
    useMemo(() => {
      const searchValue =
        search.toLowerCase().trim();

      return inventory.filter(
        (item) => {

          const searchMatch =
            item.sku
              .toLowerCase()
              .includes(searchValue) ||

            item.name
              .toLowerCase()
              .includes(searchValue) ||

            item.category
              .toLowerCase()
              .includes(searchValue);

          const categoryMatch =
            category ===
              "All Categories" ||
            item.category === category;

          const stockMatch =
            stock === "All Stock" ||

            (
              stock === "In Stock" &&
              item.stock > 0
            ) ||

            (
              stock === "Low Stock" &&
              item.status === "Low Stock"
            ) ||

            (
              stock === "Out of Stock" &&
              item.stock === 0
            );

          return (
            searchMatch &&
            categoryMatch &&
            stockMatch
          );
        }
      );
    }, [
      inventory,
      search,
      category,
      stock,
    ]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const addedItems =
    inventory.length - 8;

  const totalSkus =
    124 +
    Math.max(0, addedItems);

  const lowStockCount =
    inventory.filter(
      (item) =>
        item.status === "Low Stock"
    ).length;

  const outOfStockCount =
    inventory.filter(
      (item) =>
        item.stock === 0
    ).length;

  const additionalInventoryValue =
    inventory
      .slice(8)
      .reduce(
        (total, item) => {

          const price =
            Number(
              String(item.price)
                .replace(/[₹,]/g, "")
            );

          return (
            total +
            price *
              Number(
                item.stock || 0
              )
          );
        },
        0
      );

  const inventoryValue =
    320000 +
    additionalInventoryValue;

  const formattedInventoryValue =
    inventoryValue >= 100000
      ? `₹${(
          inventoryValue / 100000
        ).toFixed(1)}L`
      : `₹${inventoryValue.toLocaleString(
          "en-IN"
        )}`;

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleEscape = (e) => {
      if (
        e.key === "Escape" &&
        showAddModal
      ) {
        closeAddModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showAddModal]);

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div
      className={
        `inventory-page ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`
      }
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="inventory-sidebar">

        {/* LOGO */}

        <div className="inventory-sidebar-logo">

          <div className="inventory-sidebar-logo-icon">
            ▰
          </div>

          <span>
            SMARTGARAGE
          </span>

        </div>

        {/* NAVIGATION */}

        <nav className="inventory-sidebar-nav">

          {/* DASHBOARD */}

          <Link
            to="/inventory-dashboard"
            className={`inventory-sidebar-nav-item ${
              location.pathname ===
              "/inventory-dashboard"
                ? "active"
                : ""
            }`}
          >

            <span>
              ▦
            </span>

            <span className="inventory-nav-text">
              Dashboard
            </span>

          </Link>

          {/* INVENTORY */}

          <Link
            to="/inventory"
            className={`inventory-sidebar-nav-item ${
              location.pathname ===
              "/inventory"
                ? "active"
                : ""
            }`}
          >

            <span>
              ◇
            </span>

            <span className="inventory-nav-text">
              Inventory
            </span>

          </Link>

        </nav>

        {/* SIDEBAR TOGGLE */}

        <button
          type="button"
          className="inventory-sidebar-toggle"
          onClick={() =>
            setSidebarOpen(
              (previous) =>
                !previous
            )
          }
          aria-label={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
        >
          {sidebarOpen
            ? "‹"
            : "›"}
        </button>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="inventory-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="inventory-topbar">

          <div className="inventory-breadcrumb">

            <span>
              SmartGarage
            </span>

            <b>
              /
            </b>

            <strong>
              Inventory
            </strong>

          </div>

          <div className="inventory-top-actions">

            <div className="inventory-role-badge">
              INVENTORY MANAGER
            </div>

            <div className="inventory-alerts">

              <span className="inventory-alert-dot"></span>

              3 AI alerts

            </div>

            {/* GO TO LANDING PAGE */}

            <button
              type="button"
              className="inventory-settings-button"
              onClick={() =>
                navigate("/")
              }
              title="Go to Landing Page"
              aria-label="Go to Landing Page"
            >
              ⚙
            </button>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="inventory-content">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="inventory-heading">

            <h1>
              SPARE PARTS INVENTORY
            </h1>

            {/* ADD PART */}

            <button
              type="button"
              className="inventory-add-button"
              onClick={
                openAddModal
              }
            >
              + ADD PART
            </button>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="inventory-stat-grid">

            <StatCard
              title="TOTAL SKUS"
              value={totalSkus}
            />

            <StatCard
              title="LOW STOCK"
              value={lowStockCount}
              green
            />

            <StatCard
              title="OUT OF STOCK"
              value={outOfStockCount}
            />

            <StatCard
              title="INVENTORY VALUE"
              value={
                formattedInventoryValue
              }
            />

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="inventory-filter-bar">

            {/* SEARCH */}

            <div className="inventory-search-wrapper">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search by SKU, name, category..."
              />

            </div>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="inventory-filter-select"
            >

              <option>
                All Categories
              </option>

              <option>
                Lubricants
              </option>

              <option>
                Brakes
              </option>

              <option>
                Filters
              </option>

              <option>
                Electrical
              </option>

              <option>
                Ignition
              </option>

              <option>
                Tyres
              </option>

              <option>
                Engine
              </option>

              <option>
                Suspension
              </option>

              <option>
                Body Parts
              </option>

            </select>

            {/* STOCK */}

            <select
              value={stock}
              onChange={(e) =>
                setStock(
                  e.target.value
                )
              }
              className="inventory-filter-select"
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
              INVENTORY TABLE
          ================================================= */}

          <div className="inventory-table-panel">

            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>

                  <tr>

                    <th>
                      SKU
                    </th>

                    <th>
                      PART NAME
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      LOCATION
                    </th>

                    <th>
                      STOCK
                    </th>

                    <th>
                      MIN QTY
                    </th>

                    <th>
                      UNIT PRICE
                    </th>

                    <th>
                      SUPPLIER
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredInventory.map(
                    (item) => (

                      <InventoryRow
                        key={item.sku}
                        {...item}
                      />

                    )
                  )}

                  {filteredInventory.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="10"
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

      </main>

      {/* =====================================================
          ADD SPARE PART MODAL
      ===================================================== */}

      {showAddModal && (

        <div className="inventory-modal-overlay">

          {/* BACKDROP */}

          <div
            className="inventory-modal-backdrop"
            onClick={
              closeAddModal
            }
          ></div>

          {/* MODAL */}

          <div
            className="inventory-add-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-add-modal-title"
          >

            {/* HEADER */}

            <div className="inventory-modal-header">

              <h2
                id="inventory-add-modal-title"
              >
                ADD SPARE PART
              </h2>

              <button
                type="button"
                className="inventory-modal-close"
                onClick={
                  closeAddModal
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              className="inventory-add-form"
              onSubmit={
                handleAddPart
              }
            >

              {/* PART NAME */}

              <div className="inventory-form-group full">

                <label>
                  PART NAME
                </label>

                <input
                  type="text"
                  name="partName"
                  value={
                    formData.partName
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Engine Oil 5W-30 (1L)"
                  required
                />

              </div>

              {/* SKU */}

              <div className="inventory-form-group full">

                <label>
                  SKU / PART NUMBER
                </label>

                <input
                  type="text"
                  name="sku"
                  value={
                    formData.sku
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="ENO-0001"
                  required
                />

              </div>

              {/* CATEGORY + UNIT */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    CATEGORY
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleFormChange
                    }
                  >

                    <option>
                      Lubricants
                    </option>

                    <option>
                      Brakes
                    </option>

                    <option>
                      Filters
                    </option>

                    <option>
                      Electrical
                    </option>

                    <option>
                      Ignition
                    </option>

                    <option>
                      Tyres
                    </option>

                    <option>
                      Engine
                    </option>

                    <option>
                      Suspension
                    </option>

                    <option>
                      Body Parts
                    </option>

                  </select>

                </div>

                <div className="inventory-form-group">

                  <label>
                    UNIT
                  </label>

                  <select
                    name="unit"
                    value={
                      formData.unit
                    }
                    onChange={
                      handleFormChange
                    }
                  >

                    <option>
                      Piece
                    </option>

                    <option>
                      Set
                    </option>

                    <option>
                      Liter
                    </option>

                    <option>
                      Pair
                    </option>

                    <option>
                      Box
                    </option>

                    <option>
                      Kit
                    </option>

                  </select>

                </div>

              </div>

              {/* STOCK + MIN QTY */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    OPENING STOCK QTY
                  </label>

                  <input
                    type="number"
                    name="openingStock"
                    value={
                      formData.openingStock
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="10"
                    min="0"
                    required
                  />

                </div>

                <div className="inventory-form-group">

                  <label>
                    MINIMUM QTY ALERT
                  </label>

                  <input
                    type="number"
                    name="minimumQty"
                    value={
                      formData.minimumQty
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="5"
                    min="0"
                    required
                  />

                </div>

              </div>

              {/* PRICE */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    UNIT PRICE (₹)
                  </label>

                  <input
                    type="number"
                    name="unitPrice"
                    value={
                      formData.unitPrice
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="320"
                    min="0"
                    step="0.01"
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
                    value={
                      formData.sellingPrice
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="380"
                    min="0"
                    step="0.01"
                  />

                </div>

              </div>

              {/* SUPPLIER */}

              <div className="inventory-form-group full">

                <label>
                  SUPPLIER
                </label>

                <select
                  name="supplier"
                  value={
                    formData.supplier
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                >

                  <option value="">
                    Select supplier...
                  </option>

                  <option>
                    Castrol India
                  </option>

                  <option>
                    Bosch India
                  </option>

                  <option>
                    Mahle Filters
                  </option>

                  <option>
                    Shell India
                  </option>

                  <option>
                    NGK India
                  </option>

                  <option>
                    MRF Ltd
                  </option>

                  <option>
                    Amaron India
                  </option>

                  <option>
                    Mann Filters
                  </option>

                  <option>
                    Tata Motors
                  </option>

                  <option>
                    Bosch Automotive
                  </option>

                </select>

              </div>

              {/* STORAGE LOCATION */}

              <div className="inventory-form-group full">

                <label>
                  STORAGE LOCATION
                </label>

                <input
                  type="text"
                  name="storageLocation"
                  value={
                    formData.storageLocation
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Rack A1, Shelf 2"
                />

              </div>

              {/* HSN */}

              <div className="inventory-form-group full">

                <label>
                  HSN CODE (FOR GST)
                </label>

                <input
                  type="text"
                  name="hsnCode"
                  value={
                    formData.hsnCode
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="27101990"
                />

              </div>

              {/* BUTTONS */}

              <div className="inventory-modal-actions">

                <button
                  type="submit"
                  className="inventory-modal-add-button"
                >
                  ADD PART
                </button>

                <button
                  type="button"
                  className="inventory-modal-cancel-button"
                  onClick={
                    closeAddModal
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  green = false,
}) {
  return (

    <div className="inventory-stat-card">

      <div className="inventory-stat-label">
        {title}
      </div>

      <div
        className={
          `inventory-stat-value ${
            green ? "green" : ""
          }`
        }
      >
        {value}
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

  const isLow =
    status === "Low Stock";

  const isOut =
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
          isLow || isOut
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
          className={
            `inventory-status ${
              isLow || isOut
                ? "low"
                : "ok"
            }`
          }
        >
          {status}
        </span>

      </td>

      {/* EDIT BUTTON */}

      <td>

        <button
          type="button"
          className="inventory-edit-button"
          onClick={() =>
            alert(
              `Edit feature for ${name}`
            )
          }
        >
          Edit
        </button>

      </td>

    </tr>
  );
}

export default InventoryPage;