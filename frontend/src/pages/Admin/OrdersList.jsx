import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import "./OrdersList.css";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaFilter, FaSpinner } from "react-icons/fa";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    filter === "all" ? true : order.status === filter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'completed': return '🎉';
      default: return '';
    }
  };

  return (
    <div className="orders-list-container">
      <AdminNavbar/>
      <div className="orders-list-page">
        <h2>Orders Management</h2>

        <div className="orders-filters">
          <span className="filter-label"><FaFilter /> Filter by:</span>
          <button onClick={() => setFilter("all")} className={filter==="all" ? "active" : ""}>
            All ({orders.length})
          </button>
          <button onClick={() => setFilter("pending")} className={filter==="pending" ? "active" : ""}>
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button onClick={() => setFilter("accepted")} className={filter==="accepted" ? "active" : ""}>
            Accepted ({orders.filter(o => o.status === 'accepted').length})
          </button>
          <button onClick={() => setFilter("completed")} className={filter==="completed" ? "active" : ""}>
            Completed ({orders.filter(o => o.status === 'completed').length})
          </button>
        </div>

        {loading ? (
          <div className="status-message">
            <FaSpinner className="spinner" /> Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="status-message">No orders found.</p>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td data-label="Customer">{order.customerName || "Guest"}</td>
                    <td data-label="Type">{order.type}</td>
                    <td data-label="Total">₹{order.total}</td>
                    <td data-label="Status">
                      <span className={`status ${order.status}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </td>
                    <td data-label="Placed At">{new Date(order.createdAt).toLocaleString()}</td>
                    <td data-label="Actions">
                      <button 
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="view-btn"
                        title="View order details"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;