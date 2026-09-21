import React, { useMemo, useState } from "react";
import "./GarageOwnerInventory.css";

const initialInventoryData = [
  {
    sku: "ENO-7742",
    name: "Engine Oil 5W-30 (1L)",
    category: "Lubricants",
    location: "Rack A1",
    stock: 48,
    minQty: 20,
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
    minQty: 8,
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
    minQty: 5,
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
    minQty: 10,
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
    minQty: 8,
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
    minQty: 4,
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
    minQty: 3,
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
    minQty: 10,
    price: "₹180",
    supplier: "Mann Filters",
    status: "Low Stock",
  },
];

function GarageOwnerInventory() {
  /* =====================================================
     INVENTORY DATA
  ===================================================== */

  const [inventory, setInventory] = useState(initialInventoryData);


  /* =====================================================
     FILTER STATES
  ===================================================== */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");


  /* =====================================================
     ADD PART MODAL
  ===================================================== */

  const [showAddPart, setShowAddPart] = useState(false);


  /* =====================================================
     ADD PART FORM
  ===================================================== */

  const [partForm, setPartForm] = useState({
    partName: "Engine Oil 5W-30 (1L)",
    sku: "ENO-0001",
    category: "Lubricants",
    unit: "Piece",
    openingStock: "10",
    minimumQty: "5",
    unitPrice: "320",
    sellingPrice: "380",
    supplier: "",
    storageLocation: "Rack A1, Shelf 2",
    hsnCode: "27101990",
  });


  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    "All Categories",
    ...new Set(inventory.map((item) => item.category)),
  ];


  /* =====================================================
     FILTERED INVENTORY
  ===================================================== */

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const searchValue = search.toLowerCase().trim();

      const searchMatch =
        item.sku.toLowerCase().includes(searchValue) ||
        item.name.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue);

      const categoryMatch =
        category === "All Categories" ||
        item.category === category;

      let stockMatch = true;

      if (stockFilter === "Low Stock") {
        stockMatch =
          item.stock <= item.minQty &&
          item.stock > 0;
      }

      if (stockFilter === "Out of Stock") {
        stockMatch = item.stock === 0;
      }

      if (stockFilter === "In Stock") {
        stockMatch = item.stock > item.minQty;
      }

      return (
        searchMatch &&
        categoryMatch &&
        stockMatch
      );
    });
  }, [inventory, search, category, stockFilter]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const lowStock = inventory.filter(
    (item) =>
      item.stock <= item.minQty &&
      item.stock > 0
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.stock === 0
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

  const handleAddPart = (e) => {
    e.preventDefault();

    if (
      !partForm.partName.trim() ||
      !partForm.sku.trim()
    ) {
      alert("Please enter Part Name and SKU.");
      return;
    }

    const openingStock =
      Number(partForm.openingStock) || 0;

    const minimumQty =
      Number(partForm.minimumQty) || 0;

    const unitPrice =
      Number(partForm.unitPrice) || 0;

    const status =
      openingStock === 0
        ? "Out of Stock"
        : openingStock <= minimumQty
        ? "Low Stock"
        : "OK";

    const newPart = {
      sku: partForm.sku.trim(),
      name: partForm.partName.trim(),
      category: partForm.category,
      location: partForm.storageLocation.trim(),
      stock: openingStock,
      minQty: minimumQty,
      price: `₹${unitPrice.toLocaleString("en-IN")}`,
      supplier:
        partForm.supplier.trim() || "Not Assigned",
      status,
    };

    setInventory((previous) => [
      ...previous,
      newPart,
    ]);

    setShowAddPart(false);

    setPartForm({
      partName: "Engine Oil 5W-30 (1L)",
      sku: "ENO-0001",
      category: "Lubricants",
      unit: "Piece",
      openingStock: "10",
      minimumQty: "5",
      unitPrice: "320",
      sellingPrice: "380",
      supplier: "",
      storageLocation: "Rack A1, Shelf 2",
      hsnCode: "27101990",
    });
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
            Manage parts, stock levels, suppliers and procurement.
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
            124
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
            No unavailable parts
          </small>

        </div>


        <div className="inventory-stat-card">

          <span>
            INVENTORY VALUE
          </span>

          <strong>
            ₹3.2L
          </strong>

          <small>
            Current stock value
          </small>

        </div>

      </div>


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
            placeholder="Search by SKU, name, category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>


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
                <th>CATEGORY</th>
                <th>LOCATION</th>
                <th>STOCK</th>
                <th>MIN QTY</th>
                <th>UNIT PRICE</th>
                <th>SUPPLIER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>

            </thead>


            <tbody>

              {filteredItems.length > 0 ? (

                filteredItems.map((item) => (

                  <tr key={item.sku}>

                    <td className="inventory-sku">
                      {item.sku}
                    </td>

                    <td className="inventory-part-name">
                      {item.name}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>
                      {item.location}
                    </td>

                    <td
                      className={
                        item.stock <= item.minQty
                          ? "inventory-stock-low"
                          : "inventory-stock"
                      }
                    >
                      {item.stock}
                    </td>

                    <td>
                      {item.minQty}
                    </td>

                    <td className="inventory-price">
                      {item.price}
                    </td>

                    <td>
                      {item.supplier}
                    </td>

                    <td>

                      <span
                        className={
                          item.status === "Low Stock"
                            ? "inventory-status low"
                            : item.status === "Out of Stock"
                            ? "inventory-status low"
                            : "inventory-status ok"
                        }
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="inventory-edit"
                        onClick={() =>
                          alert(`Edit ${item.sku}`)
                        }
                      >
                        Edit
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

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


              {/* CATEGORY + UNIT */}

              <div className="inventory-form-row">

                <div className="inventory-form-group">

                  <label>
                    CATEGORY
                  </label>

                  <select
                    name="category"
                    value={partForm.category}
                    onChange={handlePartChange}
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
                      Ignition
                    </option>

                    <option>
                      Tyres
                    </option>

                    <option>
                      Electrical
                    </option>

                    <option>
                      Engine Parts
                    </option>

                    <option>
                      Suspension
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>


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
                    value={partForm.unitPrice}
                    onChange={handlePartChange}
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
                    value={partForm.sellingPrice}
                    onChange={handlePartChange}
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
                  value={partForm.supplier}
                  onChange={handlePartChange}
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
                  value={partForm.storageLocation}
                  onChange={handlePartChange}
                  placeholder="Rack A1, Shelf 2"
                />

              </div>


              {/* HSN CODE */}

              <div className="inventory-form-group full">

                <label>
                  HSN CODE (FOR GST)
                </label>

                <input
                  type="text"
                  name="hsnCode"
                  value={partForm.hsnCode}
                  onChange={handlePartChange}
                  placeholder="27101990"
                />

              </div>


              {/* =================================================
                  MODAL ACTIONS
              ================================================= */}

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
                  onClick={closeAddPart}
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

export default GarageOwnerInventory;