import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/admin/menu-list">View Menu</Link>
        <Link to="/admin/add-menu">Add Menu</Link>
      </nav>
      <p>Welcome! Use the links above to manage your restaurant.</p>
    </div>
  );
}
