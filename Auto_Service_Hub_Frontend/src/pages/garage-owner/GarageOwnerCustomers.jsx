import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { customersApi } from "../../services/resources";
import { getErrorMessage } from "../../services/api";
import "./GarageOwnerCustomers.css";

function GarageOwnerCustomers() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN";
  const [search, setSearch] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    customersApi.list()
      .then(setCustomers)
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return [customer.id, customer.name, customer.phone, customer.email]
        .some((field) => String(field || "").toLowerCase().includes(value));
    });
  }, [search, customers]);

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

  const handleCreateCustomer = async (e) => {
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

    setError("");
    setSaving(true);
    try {
      const created = await customersApi.create({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: [formData.address.trim(), formData.city.trim(), formData.pincode.trim()]
          .filter(Boolean)
          .join(", "),
        status: "ACTIVE",
      });
      const customer = {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: formData.phone.trim(),
        status: "ACTIVE",
      };
      setCustomers((existing) => [customer, ...existing]);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
      });
      setShowNewCustomer(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not create customer."));
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setShowNewCustomer(false);
    setError("");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
    });
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

          {isAdmin && <button
            type="button"
            className="garage-customers-new-button"
            onClick={() => setShowNewCustomer(true)}
          >
            + NEW CUSTOMER
          </button>}

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
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>

              {loading && <tr><td colSpan="5">Loading customers…</td></tr>}
              {!loading && error && <tr><td colSpan="5" role="alert">{error}</td></tr>}

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

                  <td>{customer.status || "—"}</td>
                </tr>
              ))}

            </tbody>

          </table>

          {!loading && !error && filteredCustomers.length === 0 && (
            <div className="no-customers">
              No customers found.
            </div>
          )}
        </div>

      </div>


      {/* =========================================================
          NEW CUSTOMER MODAL
      ========================================================= */}

      {isAdmin && showNewCustomer && (
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

            {error && <p role="alert" className="login-error">{error}</p>}

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
                    required
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
                    required
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
                  required
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
                  required
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


              {/* BUTTONS */}

              <div className="garage-customer-modal-actions">

                <button
                  type="submit"
                  className="garage-customer-create-button"
                >
                  {saving ? "SAVING..." : "CREATE CUSTOMER RECORD"}
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