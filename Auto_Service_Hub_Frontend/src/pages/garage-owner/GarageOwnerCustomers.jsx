import React, { useMemo, useState } from "react";
import "./GarageOwnerCustomers.css";

function GarageOwnerCustomers() {
  const [search, setSearch] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    loyalty: "Bronze",
    notes: "",
  });

  const customers = [
    {
      id: "C-1041",
      name: "Arjun Mehta",
      phone: "+91 98201 45678",
      email: "arjun.mehta@gmail.com",
      vehicles: 2,
      visits: 12,
      lastVisit: "17 Aug 2026",
      loyalty: "Gold",
      balance: "₹0",
    },
    {
      id: "C-1040",
      name: "Priya Sharma",
      phone: "+91 91234 56789",
      email: "priya.sharma@gmail.com",
      vehicles: 1,
      visits: 8,
      lastVisit: "17 Aug 2026",
      loyalty: "Silver",
      balance: "₹0",
    },
    {
      id: "C-1039",
      name: "Rohit Desai",
      phone: "+91 99876 54321",
      email: "rohit.desai@gmail.com",
      vehicles: 3,
      visits: 21,
      lastVisit: "16 Aug 2026",
      loyalty: "Platinum",
      balance: "₹0",
    },
    {
      id: "C-1038",
      name: "Neha Joshi",
      phone: "+91 88765 43210",
      email: "neha.joshi@gmail.com",
      vehicles: 1,
      visits: 5,
      lastVisit: "17 Aug 2026",
      loyalty: "Bronze",
      balance: "₹2,400",
    },
    {
      id: "C-1037",
      name: "Vikram Singh",
      phone: "+91 77654 32109",
      email: "vikram.singh@gmail.com",
      vehicles: 2,
      visits: 15,
      lastVisit: "15 Aug 2026",
      loyalty: "Gold",
      balance: "₹0",
    },
    {
      id: "C-1036",
      name: "Kavita Rao",
      phone: "+91 66543 21098",
      email: "kavita.rao@gmail.com",
      vehicles: 1,
      visits: 4,
      lastVisit: "16 Aug 2026",
      loyalty: "Bronze",
      balance: "₹0",
    },
    {
      id: "C-1035",
      name: "Sunil Nair",
      phone: "+91 55432 10987",
      email: "sunil.nair@gmail.com",
      vehicles: 1,
      visits: 9,
      lastVisit: "12 Aug 2026",
      loyalty: "Silver",
      balance: "₹1,800",
    },
    {
      id: "C-1034",
      name: "Divya Kapoor",
      phone: "+91 44321 09876",
      email: "divya.kapoor@gmail.com",
      vehicles: 2,
      visits: 7,
      lastVisit: "10 Aug 2026",
      loyalty: "Silver",
      balance: "₹0",
    },
  ];

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.id.toLowerCase().includes(value) ||
        customer.name.toLowerCase().includes(value) ||
        customer.phone.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value)
      );
    });
  }, [search]);

  /* =========================================================
     FORM HANDLER
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     CREATE CUSTOMER
  ========================================================= */

  const handleCreateCustomer = (e) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(
      `Customer ${formData.firstName} ${formData.lastName} created successfully.`
    );

    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      loyalty: "Bronze",
      notes: "",
    });

    setShowNewCustomer(false);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setShowNewCustomer(false);
  };

  return (
    <>
      <div className="garage-customers-page">

        {/* =====================================================
            PAGE TITLE + BUTTON
        ===================================================== */}

        <div className="garage-customers-heading-row">

          <h1 className="garage-customers-title">
            CUSTOMERS
          </h1>

          <button
            type="button"
            className="garage-customers-new-button"
            onClick={() => setShowNewCustomer(true)}
          >
            + NEW CUSTOMER
          </button>

        </div>


        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="garage-customers-search-row">

          <div className="garage-customers-search-box">

            <span className="garage-customers-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {/* =====================================================
            CUSTOMER TABLE
        ===================================================== */}

        <div className="garage-customers-table-container">

          <table className="garage-customers-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PHONE</th>
                <th>EMAIL</th>
                <th>VEHICLES</th>
                <th>VISITS</th>
                <th>LAST VISIT</th>
                <th>LOYALTY</th>
                <th>BALANCE</th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>

                  <td>
                    <span className="customer-id">
                      {customer.id}
                    </span>
                  </td>

                  <td>
                    <span className="customer-name">
                      {customer.name}
                    </span>
                  </td>

                  <td>
                    <span className="customer-phone">
                      {customer.phone}
                    </span>
                  </td>

                  <td>
                    <span className="customer-email">
                      {customer.email}
                    </span>
                  </td>

                  <td className="customer-number">
                    {customer.vehicles}
                  </td>

                  <td className="customer-number">
                    {customer.visits}
                  </td>

                  <td>
                    <span className="customer-date">
                      {customer.lastVisit}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`loyalty-badge ${customer.loyalty.toLowerCase()}`}
                    >
                      {customer.loyalty}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`customer-balance ${
                        customer.balance !== "₹0"
                          ? "due"
                          : ""
                      }`}
                    >
                      {customer.balance}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredCustomers.length === 0 && (
            <div className="no-customers">
              No customers found.
            </div>
          )}

        </div>

      </div>


      {/* =========================================================
          NEW CUSTOMER MODAL
      ========================================================= */}

      {showNewCustomer && (
        <div
          className="garage-customer-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="garage-customer-modal">

            {/* MODAL HEADER */}

            <div className="garage-customer-modal-header">

              <h2>
                NEW CUSTOMER
              </h2>

              <button
                type="button"
                className="garage-customer-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* MODAL BODY */}

            <form
              className="garage-customer-modal-form"
              onSubmit={handleCreateCustomer}
            >

              {/* FIRST + LAST NAME */}

              <div className="garage-customer-form-row">

                <div className="garage-customer-form-group">

                  <label>
                    FIRST NAME
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="Rajesh"
                    value={formData.firstName}
                    onChange={handleChange}
                  />

                </div>


                <div className="garage-customer-form-group">

                  <label>
                    LAST NAME
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Kumar"
                    value={formData.lastName}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="garage-customer-form-group">

                <label>
                  PHONE NUMBER
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              {/* EMAIL */}

              <div className="garage-customer-form-group">

                <label>
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="rajesh.kumar@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>


              {/* ADDRESS */}

              <div className="garage-customer-form-group">

                <label>
                  ADDRESS
                </label>

                <textarea
                  name="address"
                  placeholder="123, MG Road, Mumbai - 400001"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                />

              </div>


              {/* CITY + PINCODE */}

              <div className="garage-customer-form-row">

                <div className="garage-customer-form-group">

                  <label>
                    CITY
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                  />

                </div>


                <div className="garage-customer-form-group">

                  <label>
                    PINCODE
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* LOYALTY */}

              <div className="garage-customer-form-group">

                <label>
                  LOYALTY TIER
                </label>

                <select
                  name="loyalty"
                  value={formData.loyalty}
                  onChange={handleChange}
                >
                  <option value="Bronze">
                    Bronze
                  </option>

                  <option value="Silver">
                    Silver
                  </option>

                  <option value="Gold">
                    Gold
                  </option>

                  <option value="Platinum">
                    Platinum
                  </option>
                </select>

              </div>


              {/* NOTES */}

              <div className="garage-customer-form-group">

                <label>
                  NOTES / PREFERENCES
                </label>

                <textarea
                  name="notes"
                  placeholder="VIP customer, prefers weekend appointments..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                />

              </div>


              {/* DIVIDER */}

              <div className="garage-customer-modal-divider"></div>


              {/* BUTTONS */}

              <div className="garage-customer-modal-actions">

                <button
                  type="submit"
                  className="garage-customer-create-button"
                >
                  CREATE CUSTOMER
                </button>

                <button
                  type="button"
                  className="garage-customer-cancel-button"
                  onClick={closeModal}
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

export default GarageOwnerCustomers;