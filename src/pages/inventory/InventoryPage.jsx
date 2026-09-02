import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./InventoryPage.css";

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stock, setStock] = useState("All Stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const inventory = [
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
              value="124"
              text="Active inventory items"
            />

            <StatCard
              title="LOW STOCK"
              value="3"
              text="Items need attention"
              green
            />

            <StatCard
              title="OUT OF STOCK"
              value="0"
              text="No unavailable parts"
            />

            <StatCard
              title="INVENTORY VALUE"
              value="₹3.2L"
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

                  {filteredInventory.map((item) => (

                    <InventoryRow
                      key={item.sku}
                      {...item}
                    />

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
  category,
  location,
  stock,
  min,
  price,
  supplier,
  status,
}) {
  const lowStock = status === "Low Stock";

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
          lowStock
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
            lowStock ? "low" : "ok"
          }`}
        >
          {status}
        </span>

      </td>

    </tr>
  );
}


export default InventoryPage;