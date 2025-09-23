import React, { useEffect, useState, useRef } from "react";
import api from "../../api/apiClient";
import CartDrawer from "../../components/CartDrawer";
import CheckoutModal from "../../components/CheckoutModal";
import "./OrderPage.css";
import { FaTimes, FaBars } from "react-icons/fa";

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const OrderPage = () => {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpenNow, setIsOpenNow] = useState(true);
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};
        setSettings(data);
        setIsOpenNow(checkIfOpen(data));
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();

    // Re-check every minute (keeps open/closed status live)
    const interval = setInterval(() => {
      if (settings) setIsOpenNow(checkIfOpen(settings));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch menu", err);
      }
    };
    fetchMenu();
  }, []);

  // ✅ Function to check open/close status
  const checkIfOpen = (data) => {
    if (!data?.general?.restaurantOpen) return false;

    const now = new Date();
    const today = days[now.getDay() === 0 ? 6 : now.getDay() - 1]; // map Sunday=0 -> sunday
    const hours = data.hours?.[today];

    if (!hours || !hours.enabled) return false;

    const currentTime = now.toTimeString().slice(0, 5);
    return currentTime >= hours.open && currentTime <= hours.close;
  };

  // ✅ Cart actions (block if closed)
  const addToCart = (item) => {
    if (!isOpenNow) return alert("Sorry, the restaurant is currently closed.");
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setCart([]);

  const scrollToCategory = (id) => {
    categoryRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="order-page-container">
      {loading ? (
        <p>Loading...</p>
      ) : !isOpenNow ? (
        <div className="closed-message">
          <h2>Sorry! The restaurant is currently closed.</h2>
          {settings?.hours && (
            <p>
              Today's Hours:{" "}
              {(() => {
                const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
                const h = settings.hours[today];
                return h?.enabled ? `${h.open} - ${h.close}` : "Closed Today";
              })()}
            </p>
          )}
        </div>
      ) : (
        <div className="order-page">
          {/* Sidebar overlay */}
          {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

          {/* Category sidebar */}
          <aside className={`category-sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Categories</h3>
              <button className="sidebar-close-btn" onClick={toggleSidebar}>
                <FaTimes />
              </button>
            </div>
            <div className="category-list">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className="category-btn"
                  onClick={() => scrollToCategory(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Menu section */}
          <main className="menu-content">
            <div className="menu-header">
              <button className="menu-toggle" onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h2 className="menu-title">Our Menu</h2>
            </div>

            {categories.map((cat) => (
              <section
                key={cat._id}
                ref={(el) => (categoryRefs.current[cat._id] = el)}
                className="category-section"
              >
                <h3 className="category-title">{cat.name}</h3>
                <div className="items-grid">
                  {(cat.items || []).map((item) => (
                    <div className="item-card" key={item._id}>
                      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
                      {item.badge && <span className="item-badge">{item.badge}</span>}

                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        {item.description && <p className="item-description">{item.description}</p>}
                        {item.tags?.length > 0 && (
                          <div className="item-tags">
                            {item.tags.map((tag, i) => (
                              <span className="tag" key={i}>{tag}</span>
                            ))}
                          </div>
                        )}
                        <p className="item-price">₹{item.price}</p>
                        {item.available === false && <p className="item-unavailable">Currently Unavailable</p>}
                      </div>

                      <button
                        className="add-btn1"
                        disabled={item.available === false}
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>

          {/* Floating cart button */}
          <button className="cart-fab" onClick={() => isOpenNow && setCartOpen(true)} disabled={!isOpenNow}>
            🛒
            {cart.length > 0 && <span className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
          </button>

          {/* Cart drawer */}
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            onCheckoutClick={() => {
              if (!isOpenNow) return alert("Sorry, we are closed right now.");
              setCheckoutOpen(true);
              setCartOpen(false);
            }}
          />

          {/* Checkout modal */}
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            cart={cart}
            clearCart={clearCart}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage;
