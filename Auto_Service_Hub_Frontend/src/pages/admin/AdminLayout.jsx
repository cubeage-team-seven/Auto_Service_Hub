import React from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Admin.css";

export default function AdminLayout() {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link to="/admin" className="admin-brand">Auto_Service_Hub <span>ADMIN</span></Link>
        <nav>
          <Link to="/admin">Access &amp; staff</Link>
          <Link to="/admin/customers">Customers</Link>
        </nav>
        <div className="admin-identity">
          <span>{user?.fullName || user?.username}</span>
          <button type="button" onClick={logout}>Sign out</button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
