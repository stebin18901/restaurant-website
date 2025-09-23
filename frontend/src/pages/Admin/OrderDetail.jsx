import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [readyMinutes, setReadyMinutes] = useState(15);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
  try {
    const res = await api.get(`/orders/${id}`);
    setOrder(res.data);
  } catch (err) {
    console.error("Failed to fetch order", err);
  }
};


  const updateStatus = async (status) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
        readyInMinutes: status === "accepted" ? readyMinutes : undefined,
      });
      alert(`Order ${status}`);
      navigate("/admin/orders");
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-detail-page">
      <button onClick={() => navigate("/admin/orders")} className="back-btn">← Back</button>
      <h2>Order Details</h2>

      <p><strong>Customer:</strong> {order.customerName || "Guest"}</p>
      <p><strong>Type:</strong> {order.type}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h3>Items</h3>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</li>
        ))}
      </ul>

      {order.type === "delivery" && (
        <>
          <h3>Address</h3>
          <p>{order.address?.line1}, {order.address?.city}, {order.address?.state} {order.address?.zip}</p>
          <p>Phone: {order.address?.phone}</p>
        </>
      )}

      {order.status === "pending" && (
        <div className="actions">
          <label>Ready in: 
            <input type="number" value={readyMinutes} min="5" max="120"
              onChange={e => setReadyMinutes(Number(e.target.value))} /> mins
          </label>
          <button className="accept" onClick={() => updateStatus("accepted")}>Accept</button>
          <button className="reject" onClick={() => updateStatus("rejected")}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
