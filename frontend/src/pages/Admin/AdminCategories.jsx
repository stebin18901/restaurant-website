import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import AdminNavbar from "./AdminNavbar";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "", image: "" });
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCat.name.trim()) {
      alert("Category name is required.");
      return;
    }
    try {
      await api.post("/categories", newCat);
      setNewCat({ name: "", description: "", image: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category and all its associated items?")) {
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-page">
        <h1 className="page-title">Manage Categories</h1>

        {/* Add Category Form */}
        <div className="add-category-form">
          <input
            type="text"
            placeholder="Category Name"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newCat.image}
            onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
            className="form-input"
          />
          <button onClick={handleAdd} className="add-button">
            <FaPlus className="button-icon" />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="category-grid">
          {categories.map((c) => (
            <div key={c._id} className="category-card">
              {c.image && (
                <div className="category-image-container">
                  <img src={c.image} alt={c.name} className="category-image" />
                </div>
              )}
              <div className="category-info">
                <h3 className="category-name">{c.name}</h3>
                <p className="category-description">{c.description}</p>
              </div>
              <div className="category-actions">
                <button
                  onClick={() => navigate(`/admin/items?category=${c._id}`)}
                  className="view-items-button"
                >
                  <FaEye className="button-icon" />
                  
                </button>
                <button onClick={() => handleDelete(c._id)} className="delete-button">
                  <FaTrash className="button-icon" />
                  
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;