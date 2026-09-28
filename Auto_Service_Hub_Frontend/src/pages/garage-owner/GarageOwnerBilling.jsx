import React, { useState } from "react";
import "./GarageOwnerBilling.css";

const invoices = [
  {
    invoice: "INV-0892",
    customer: "Rohit Desai",
    vehicle: "Innova GJ-05",
    jobCard: "JC-2406",
    date: "16 Aug 2026",
    amount: "₹12,400",
    gst: "₹2,232",
    total: "₹14,632",
    status: "Paid",
    mode: "UPI",
  },
  {
    invoice: "INV-0891",
    customer: "Kavita Rao",
    vehicle: "Baleno KA-03",
    jobCard: "JC-2403",
    date: "16 Aug 2026",
    amount: "₹3,200",
    gst: "₹576",
    total: "₹3,776",
    status: "Paid",
    mode: "Cash",
  },
  {
    invoice: "INV-0890",
    customer: "Neha Joshi",
    vehicle: "City MH-14",
    jobCard: "JC-2405",
    date: "17 Aug 2026",
    amount: "₹4,800",
    gst: "₹864",
    total: "₹5,664",
    status: "Pending",
    mode: "—",
  },
  {
    invoice: "INV-0889",
    customer: "Sunil Nair",
    vehicle: "Fortuner UP-78",
    jobCard: "JC-2401",
    date: "11 Aug 2026",
    amount: "₹28,500",
    gst: "₹5,130",
    total: "₹33,630",
    status: "Overdue",
    mode: "—",
  },
  {
    invoice: "INV-0888",
    customer: "Divya Kapoor",
    vehicle: "Polo MH-09",
    jobCard: "JC-2399",
    date: "10 Aug 2026",
    amount: "₹7,600",
    gst: "₹1,368",
    total: "₹8,968",
    status: "Paid",
    mode: "Card",
  },
];

function GarageOwnerBilling() {
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  const [estimateType, setEstimateType] = useState("Estimate");
  const [customer, setCustomer] = useState("");
  const [jobCard, setJobCard] = useState("");

  const [lineItems, setLineItems] = useState([
    {
      description: "Engine Oil Change",
      qty: "",
      price: "",
    },
    {
      description: "Oil Filter",
      qty: "",
      price: "",
    },
  ]);

  const [discount, setDiscount] = useState("0");
  const [gstRate, setGstRate] = useState("18");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [notes, setNotes] = useState("");

  /* =========================================
     OPEN MODAL
  ========================================= */

  const openEstimateModal = () => {
    setShowEstimateModal(true);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeEstimateModal = () => {
    setShowEstimateModal(false);
  };

  /* =========================================
     ADD LINE ITEM
  ========================================= */

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        description: "",
        qty: "",
        price: "",
      },
    ]);
  };

  /* =========================================
     UPDATE LINE ITEM
  ========================================= */

  const updateLineItem = (index, field, value) => {
    setLineItems((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  /* =========================================
     SAVE ESTIMATE
  ========================================= */

  const handleSaveEstimate = (e) => {
    e.preventDefault();

    alert(
      `${estimateType} saved successfully.`
    );

    setShowEstimateModal(false);
  };

  /* =========================================
     VIEW INVOICE
  ========================================= */

  const handleViewInvoice = (invoice) => {
    alert(`Viewing ${invoice}`);
  };

  return (
    <>
      {/* =========================================
          BILLING PAGE
      ========================================= */}

      <div className="billing-page">

        {/* =========================================
            PAGE TOP
        ========================================= */}

        <div className="billing-page-top">

          <h1>
            BILLING &amp; PAYMENTS
          </h1>

          <button
            type="button"
            className="billing-estimate-button"
            onClick={openEstimateModal}
          >
            + NEW ESTIMATE
          </button>

        </div>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="billing-stats">

          <div className="billing-stat">

            <span>
              THIS MONTH
            </span>

            <strong>
              ₹4.8L
            </strong>

          </div>


          <div className="billing-stat">

            <span>
              PENDING
            </span>

            <strong className="lime">
              ₹48,294
            </strong>

          </div>


          <div className="billing-stat">

            <span>
              OVERDUE
            </span>

            <strong>
              ₹33,630
            </strong>

          </div>


          <div className="billing-stat">

            <span>
              AVG INVOICE
            </span>

            <strong>
              ₹12,400
            </strong>

          </div>

        </div>


        {/* =========================================
            BILLING TABLE
        ========================================= */}

        <div className="billing-table-card">

          <div className="billing-table-wrapper">

            <table className="billing-table">

              <thead>

                <tr>

                  <th>
                    INVOICE
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    VEHICLE
                  </th>

                  <th>
                    JOB CARD
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    GST (18%)
                  </th>

                  <th>
                    TOTAL
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    MODE
                  </th>

                  <th></th>

                </tr>

              </thead>


              <tbody>

                {invoices.map((invoice) => (

                  <tr key={invoice.invoice}>

                    <td className="billing-invoice">
                      {invoice.invoice}
                    </td>

                    <td className="billing-customer">
                      {invoice.customer}
                    </td>

                    <td>
                      {invoice.vehicle}
                    </td>

                    <td>
                      {invoice.jobCard}
                    </td>

                    <td>
                      {invoice.date}
                    </td>

                    <td className="billing-amount">
                      {invoice.amount}
                    </td>

                    <td>
                      {invoice.gst}
                    </td>

                    <td className="billing-total">
                      {invoice.total}
                    </td>

                    <td>

                      <span
                        className={`billing-status ${invoice.status.toLowerCase()}`}
                      >
                        {invoice.status}
                      </span>

                    </td>

                    <td>
                      {invoice.mode}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="billing-view"
                        onClick={() =>
                          handleViewInvoice(invoice.invoice)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =========================================
          NEW ESTIMATE / INVOICE MODAL
      ========================================= */}

      {showEstimateModal && (

        <div
          className="billing-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              closeEstimateModal();
            }

          }}
        >

          <div className="billing-estimate-modal">

            {/* =====================================
                MODAL HEADER
            ===================================== */}

            <div className="billing-modal-header">

              <div>

                <div className="billing-modal-eyebrow">
                  NEW ESTIMATE / INVOICE
                </div>

              </div>

              <button
                type="button"
                className="billing-modal-close"
                onClick={closeEstimateModal}
              >
                ×
              </button>

            </div>


            {/* =====================================
                FORM
            ===================================== */}

            <form
              className="billing-estimate-form"
              onSubmit={handleSaveEstimate}
            >

              {/* =================================
                  ESTIMATE / INVOICE
              ================================= */}

              <div className="billing-type-selector">

                <label
                  className={`billing-type-option ${
                    estimateType === "Estimate"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="estimateType"
                    value="Estimate"
                    checked={
                      estimateType === "Estimate"
                    }
                    onChange={(e) =>
                      setEstimateType(e.target.value)
                    }
                  />

                  <span className="billing-radio-circle"></span>

                  <span>
                    Estimate
                  </span>

                </label>


                <label
                  className={`billing-type-option ${
                    estimateType === "Invoice"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="estimateType"
                    value="Invoice"
                    checked={
                      estimateType === "Invoice"
                    }
                    onChange={(e) =>
                      setEstimateType(e.target.value)
                    }
                  />

                  <span className="billing-radio-circle"></span>

                  <span>
                    Invoice
                  </span>

                </label>

              </div>


              {/* =================================
                  CUSTOMER
              ================================= */}

              <div className="billing-form-field">

                <label>
                  CUSTOMER
                </label>

                <select
                  value={customer}
                  onChange={(e) =>
                    setCustomer(e.target.value)
                  }
                >

                  <option value="">
                    Select customer...
                  </option>

                  <option value="Rohit Desai">
                    Rohit Desai
                  </option>

                  <option value="Kavita Rao">
                    Kavita Rao
                  </option>

                  <option value="Neha Joshi">
                    Neha Joshi
                  </option>

                  <option value="Sunil Nair">
                    Sunil Nair
                  </option>

                  <option value="Divya Kapoor">
                    Divya Kapoor
                  </option>

                </select>

              </div>


              {/* =================================
                  JOB CARD
              ================================= */}

              <div className="billing-form-field">

                <label>
                  JOB CARD
                </label>

                <select
                  value={jobCard}
                  onChange={(e) =>
                    setJobCard(e.target.value)
                  }
                >

                  <option value="">
                    Link to job card (optional)
                  </option>

                  <option value="JC-2406">
                    JC-2406
                  </option>

                  <option value="JC-2405">
                    JC-2405
                  </option>

                  <option value="JC-2403">
                    JC-2403
                  </option>

                  <option value="JC-2401">
                    JC-2401
                  </option>

                  <option value="JC-2399">
                    JC-2399
                  </option>

                </select>

              </div>


              {/* =================================
                  LINE ITEMS
              ================================= */}

              <div className="billing-line-items">

                <div className="billing-section-label">
                  LINE ITEMS
                </div>


                {lineItems.map((item, index) => (

                  <div
                    className="billing-line-item"
                    key={index}
                  >

                    <input
                      type="text"
                      placeholder="Item / service"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "qty",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={item.price}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                    />

                    <span className="billing-line-total">
                      = ₹ —
                    </span>

                  </div>

                ))}


                <button
                  type="button"
                  className="billing-add-line"
                  onClick={addLineItem}
                >
                  + Add Line Item
                </button>

              </div>


              {/* =================================
                  DISCOUNT + GST
              ================================= */}

              <div className="billing-form-grid">

                <div className="billing-form-field">

                  <label>
                    DISCOUNT (₹)
                  </label>

                  <input
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(e.target.value)
                    }
                  />

                </div>


                <div className="billing-form-field">

                  <label>
                    GST RATE (%)
                  </label>

                  <select
                    value={gstRate}
                    onChange={(e) =>
                      setGstRate(e.target.value)
                    }
                  >

                    <option value="0">
                      0
                    </option>

                    <option value="5">
                      5
                    </option>

                    <option value="12">
                      12
                    </option>

                    <option value="18">
                      18
                    </option>

                    <option value="28">
                      28
                    </option>

                  </select>

                </div>

              </div>


              {/* =================================
                  PAYMENT MODE
              ================================= */}

              <div className="billing-form-field">

                <label>
                  PAYMENT MODE
                </label>

                <select
                  value={paymentMode}
                  onChange={(e) =>
                    setPaymentMode(e.target.value)
                  }
                >

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                </select>

              </div>


              {/* =================================
                  NOTES
              ================================= */}

              <div className="billing-form-field">

                <label>
                  NOTES
                </label>

                <textarea
                  className="billing-notes"
                  placeholder="Any special terms or notes..."
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                />

              </div>


              {/* =================================
                  ACTIONS
              ================================= */}

              <div className="billing-modal-actions">

                <button
                  type="submit"
                  className="billing-modal-create"
                >
                  SAVE {estimateType.toUpperCase()}
                </button>

                <button
                  type="button"
                  className="billing-modal-cancel"
                  onClick={closeEstimateModal}
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

export default GarageOwnerBilling;