import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import AdminNavbar from "./AdminNavbar";
import "./AdminItems.css";

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    isVeg: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchItems = async () => {
    const categoryQuery = searchParams.get("category");
    const res = await api.get(
      `/items${categoryQuery ? `?category=${categoryQuery}` : ""}`
    );
    setItems(res.data);
    setFilteredItems(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [searchParams]);

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price)
      return alert("Name and Price required");
    await api.post("/items", { ...newItem, price: Number(newItem.price) });
    setNewItem({ name: "", price: "", category: "", isVeg: true });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/items/${id}`);
    fetchItems();
  };

  // ✅ Filter & Reset Pagination
  useEffect(() => {
    let filtered = items;
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(
        (item) => item.category?._id === categoryFilter
      );
    }
    setFilteredItems(filtered);
    setCurrentPage(1); // reset to first page on filter change
  }, [searchQuery, categoryFilter, items]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    navigate(selectedCategory ? `?category=${selectedCategory}` : "");
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-page">
        <h2>Items</h2>

        {/* Search + Filter */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Item Form */}
        <div className="add-form">
          <input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
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
              checked={newItem.isVeg}
              onChange={(e) =>
                setNewItem({ ...newItem, isVeg: e.target.checked })
              }
            />
            Veg?
          </label>
          <button onClick={handleAdd}>Add Item</button>
        </div>

        {/* Item List */}
        <div className="item-list">
          {currentItems.length === 0 ? (
            <p className="no-items">No items found.</p>
          ) : (
            currentItems.map((i) => (
              <div key={i._id} className="item-card">
                <div className="item-card-info">
                  {i.image && <img src={i.image} alt={i.name} />}
                  <div>
                    <h4>
                      {i.name} - ₹{i.price}
                    </h4>
                    <small>{i.category?.name}</small>
                    {i.badge && <span className="badge">{i.badge}</span>}
                    <p>{i.description}</p>
                  </div>
                </div>
                <div>
                  <button
                    className="but1"
                    onClick={() => navigate(`/admin/items/${i._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button className="but2" onClick={() => handleDelete(i._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItems;
