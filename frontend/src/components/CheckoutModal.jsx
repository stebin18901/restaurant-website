import React, { useState, useEffect } from "react";
import api from "../api/apiClient";
import "./CheckoutModal.css";
import { FaTimes } from "react-icons/fa"; // Import the close icon

export default function CheckoutModal({ open, onClose, cart, clearCart }) {
  const [customerName, setCustomerName] = useState("");
  const [type, setType] = useState("collection"); // 'delivery' or 'collection'
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "", phone: "" });
  const [paymentMode, setPaymentMode] = useState("cash"); // 'cash'/'online'
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };
  fetchSettings();
}, []);


  useEffect(() => {
    if (!open) {
      setCustomerName("");
      setType("collection");
      setAddress({ line1: "", line2: "", city: "", state: "", zip: "", phone: "" });
      setPaymentMode("cash");
    }
  }, [open]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    if (type === "delivery") {
      if (!address.line1 || !address.city || !address.phone) {
        return alert("Please enter address line 1, city, and phone for delivery.");
      }
    }

    const payload = {
      items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
      total,
      customerName,
      type,
      address: type === "delivery" ? address : undefined,
      paymentMode,
    };

    try {
      setLoading(true);
      const res = await api.post("/orders", payload);
      setLoading(false);

      if (res.status === 201) {
        alert("Order placed! Order ID: " + res.data._id);
        clearCart();
        onClose();
      } else {
        alert("Order response: " + JSON.stringify(res.data));
      }
    } catch (err) {
      setLoading(false);
      console.error("Checkout error:", err.response?.data || err.message);
      alert("Failed to place order.");
    }
  };

  if (!open) return null;

  return (
    <div className="checkout-modal-container">
      <div className="checkout-modal-panel">
        <div className="checkout-header">
          <h3>Checkout</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="checkout-body">
          <div className="section">
            <label className="section-label">Order Type</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  checked={type === "collection"}
                  onChange={() => setType("collection")}
                />
                Collection
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  checked={type === "delivery"}
                  onChange={() => setType("delivery")}
                />
                Delivery
              </label>
            </div>
          </div>

          <div className="section">
            <label className="section-label">Customer Information</label>
            <input
              className="input-field"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name (optional)"
            />
            <input
              className="input-field"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          {type === "delivery" && (
            <div className="section">
              <label className="section-label">Delivery Address</label>
              <input
                className="input-field"
                placeholder="Address line 1"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Address line 2 (optional)"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="ZIP"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              />
            </div>
          )}

          <div className="section">
            <label className="section-label">Payment Mode</label>
            <div className="radio-group">
              Disable unavailable payment modes
<label className="radio-option">
  <input
    type="radio"
    checked={paymentMode === "cash"}
    disabled={!settings?.general?.cashPayment}
    onChange={() => setPaymentMode("cash")}
  />
  Cash
</label>
<label className="radio-option">
  <input
    type="radio"
    checked={paymentMode === "online"}
    disabled={!settings?.general?.cardPayment}
    onChange={() => setPaymentMode("online")}
  />
  Card / Online
</label>

            </div>
          </div>
        </div>

        <div className="checkout-footer">
          <div className="checkout-summary">
            <p>Total Items: {cart.length}</p>
            <p className="total-price">Total: ₹{total}</p>
          </div>
          <button onClick={submitOrder} disabled={loading} className="place-order-btn">
            {loading ? "Placing Order..." : `Place Order`}
          </button>
        </div>
      </div>
      <div className="checkout-overlay" onClick={onClose} />
    </div>
  );
}