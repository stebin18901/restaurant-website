import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import AdminNavbar from "./AdminNavbar";
import "./AdminEditItems.css";

const AdminEditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    };
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchItem();
    fetchCategories();
  }, [id]);

  const handleSave = async () => {
    await api.put(`/items/${id}`, item);
    alert("Item updated successfully!");
    navigate("/admin/items");
  };

  if (!item) return <p>Loading item...</p>;

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-page" style={{width: '100%'}}>
        <h2>Edit Item</h2>

      <div className="edit-form">
        <input
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="number"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
          placeholder="Price"
        />
        <textarea
          value={item.description || ""}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          placeholder="Description"
        />
        <input
          value={item.image || ""}
          onChange={(e) => setItem({ ...item, image: e.target.value })}
          placeholder="Image URL"
        />
        <input
          value={item.size || ""}
          onChange={(e) => setItem({ ...item, size: e.target.value })}
          placeholder="Size (optional)"
        />
        <input
          value={item.badge || ""}
          onChange={(e) => setItem({ ...item, badge: e.target.value })}
          placeholder="Badge (optional)"
        />
        <select
          value={item.category?._id || ""}
          onChange={(e) => setItem({ ...item, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={item.isVeg}
            onChange={(e) => setItem({ ...item, isVeg: e.target.checked })}
          />
          Veg?
        </label>

        <button onClick={handleSave}>Save Changes</button>
        <button onClick={() => navigate("/admin/items")}>Cancel</button>
      </div>
    </div>
      </div>
      
  );
};

export default AdminEditItem;
