import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt, FaHome, FaUtensils, FaTags, FaShoppingBag, FaCog } from "react-icons/fa";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/items", icon: <FaUtensils />, label: "Menu" },
    { path: "/admin/categories", icon: <FaTags />, label: "Categories" },
    { path: "/admin/orders", icon: <FaShoppingBag />, label: "Orders" },
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" }
  ];

  return (
    <nav className={`admin-navbar ${menuOpen ? "open" : ""}`}>
      <div className="navbar-header">
        <h1 className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
          Admin Panel
        </h1>
        <div className="menu-toggle1" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      <div className="admin-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default AdminNavbar;