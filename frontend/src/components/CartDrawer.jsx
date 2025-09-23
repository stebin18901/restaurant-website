import React from "react";
import "./CartDrawer.css";

export default function CartDrawer({
  open,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  onCheckoutClick
}) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <>
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 && <p className="empty">Cart is empty</p>}
          {cart.map(item => (
            <div className="cart-row" key={item._id}>
              <div className="cart-row-left">
                <div className="cart-name">{item.name}</div>
                <div className="cart-price">₹{item.price} each</div>
              </div>

              <div className="cart-row-right">
                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                <span className="qty">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                <button className="remove" onClick={() => removeItem(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">Total: ₹{total}</div>
          <button className="checkout-btn" disabled={cart.length === 0} onClick={() => onCheckoutClick()}>
            Checkout
          </button>
        </div>
      </div>

      {open && <div className="cart-overlay" onClick={onClose} />}
    </>
  );
}