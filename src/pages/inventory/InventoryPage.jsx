import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getParts } from "../../services/inventoryService";
import "./InventoryPage.css";

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stock, setStock] = useState("All Stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParts(0, 200)
      .then((page) => setInventory(page.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const searchMatch =
      item.sku?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = category === "All Categories";
    const stockMatch =
      stock === "All Stock" ||
      (stock === "In Stock" && !item.lowStock) ||
      (stock === "Low Stock" && item.lowStock) ||
      (stock === "Out of Stock" && item.stockQty === 0);
    return searchMatch && categoryMatch && stockMatch;
  });

  return (
    <div className={`inventory-page ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="inventory-sidebar">

        <div className="inventory-sidebar-logo">

          <div className="inventory-sidebar-logo-icon">
            ▰
          </div>

          <span>
           Auto_Service_Hub
          </span>

        </div>


        <nav className="inventory-sidebar-nav">

          <Link
            to="/inventory-dashboard"
            className="inventory-sidebar-nav-item"
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link
            to="/inventory"
            className="inventory-sidebar-nav-item active"
          >
            <span>◈</span>
            Inventory
          </Link>

        </nav>

        <button
          className="inventory-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? "‹" : "›"}
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
              Auto_Service_Hub
            </span>

            <b>
              /
            </b>

            <strong>
              Inventory
            </strong>

          </div>


          <div className="inventory-top-actions">

            <span className="inventory-role-badge">
              INVENTORY MANAGER
            </span>

            <Link
              to="/"
              className="inventory-dashboard-button"
              title="Home"
            >
              ⌂
            </Link>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

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
              value={inventory.length}
              text="Active inventory items"
            />

            <StatCard
              title="LOW STOCK"
              value={inventory.filter((i) => i.lowStock).length}
              text="Items need attention"
              green
            />

            <StatCard
              title="OUT OF STOCK"
              value={inventory.filter((i) => i.stockQty === 0).length}
              text="Unavailable parts"
            />

            <StatCard
              title="INVENTORY VALUE"
              value={`₹${inventory.reduce((s, i) => s + (i.sellingPrice ?? 0) * (i.stockQty ?? 0), 0).toLocaleString("en-IN")}`}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by SKU, name, category..."
              />

            </div>


            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Lubricants</option>
              <option>Brakes</option>
              <option>Filters</option>
              <option>Electrical</option>
              <option>Ignition</option>
              <option>Tyres</option>
            </select>


            <select
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              <option>All Stock</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
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

                  {loading && (
                    <tr><td colSpan="9" className="inventory-empty">Loading...</td></tr>
                  )}

                  {!loading && filteredInventory.map((item) => (
                    <InventoryRow key={item.id} {...item} />
                  ))}


                  {filteredInventory.length === 0 && (

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

      </main>

    </div>
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
  stockQty,
  minStock,
  sellingPrice,
  lowStock,
}) {
  return (
    <tr>
      <td className="inventory-sku">{sku}</td>
      <td className="inventory-part-name">{name}</td>
      <td>—</td>
      <td>—</td>
      <td className={lowStock ? "inventory-stock low" : "inventory-stock"}>{stockQty}</td>
      <td>{minStock}</td>
      <td className="inventory-price">{sellingPrice ? `₹${Number(sellingPrice).toLocaleString("en-IN")}` : "—"}</td>
      <td>—</td>
      <td>
        <span className={`inventory-status ${lowStock ? "low" : "ok"}`}>
          {lowStock ? "Low Stock" : "OK"}
        </span>
      </td>
    </tr>
  );
}


export default InventoryPage;