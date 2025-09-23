import React, { useState, useEffect } from "react";
import api from "../../api/apiClient";
import AdminNavbar from "./AdminNavbar";
import "./AdminSettings.css";

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const tabs = ["general","restaurant info","hours","delivery"];

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};
        
        // Initialize default hours if missing
        data.hours = data.hours || {};
        days.forEach(day => {
          data.hours[day] = {
            enabled: data.hours[day]?.enabled || false,
            open: data.hours[day]?.open || "09:00",
            close: data.hours[day]?.close || "17:00"
          };
        });

        // Initialize general settings if missing
        data.general = data.general || { restaurantOpen: true, cardPayment: true, cashPayment: true, delivery: true, collection: true };

        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSettings({});
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      setSaveStatus("Saving...");
      await api.put("/settings", settings);
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("Error saving settings");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;
  if (!settings) return <div className="admin-container"><p>No settings found</p></div>;

  // Function to copy first day's hours to all
  const applyToAllDays = () => {
    const firstDay = settings.hours[days[0]];
    const newHours = {};
    days.forEach(day => newHours[day] = {...firstDay});
    setSettings(prev => ({ ...prev, hours: newHours }));
  };

  return (
    <div className="admin-container1">
      <AdminNavbar />
      <h2>Admin Settings</h2>

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Status */}
      {saveStatus && <div className={`status-message ${saveStatus.includes("Error") ? "error" : "success"}`}>{saveStatus}</div>}

      {/* GENERAL */}
      {activeTab === "general" && (
        <section className="settings-section">
          <h3>General Settings</h3>
          <div className="settings-grid">
            {Object.keys(settings.general || {}).map((key) => (
              <label key={key} className="checkbox-label">
                <input type="checkbox"
                  checked={settings.general[key] || false}
                  onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, [key]: e.target.checked } }))}
                />
                <span className="checkmark"></span>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </section>
      )}

      {/* RESTAURANT INFO */}
      {activeTab === "restaurant info" && (
        <section className="settings-section">
          <h3>Restaurant Information</h3>
          <div className="form-grid">
            {["name","address","phone","email","description"].map(field => (
              <div key={field} className="input-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "description" ? (
                  <textarea
                    value={settings.restaurant?.[field] || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, restaurant: { ...prev.restaurant, [field]: e.target.value } }))}
                  />
                ) : (
                  <input
                    type={field==="email"?"email":"text"}
                    value={settings.restaurant?.[field] || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, restaurant: { ...prev.restaurant, [field]: e.target.value } }))}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOURS */}
      {activeTab === "hours" && (
        <section className="settings-section">
          <h3>Opening Hours</h3>
          <button className="apply-all-btn" onClick={applyToAllDays}>Apply To All Days</button>
          <div className="hours-grid">
            {days.map(day => (
              <div key={day} className="day-row">
                <label className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={settings.hours[day].enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hours: { ...prev.hours, [day]: { ...prev.hours[day], enabled: e.target.checked } }
                    }))}
                  />
                  <span className="checkmark"></span>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
                <div className="time-inputs">
                  <input
                    type="time"
                    value={settings.hours[day].open}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hours: { ...prev.hours, [day]: { ...prev.hours[day], open: e.target.value } }
                    }))}
                    disabled={!settings.hours[day].enabled}
                  />
                  <span className="time-separator">to</span>
                  <input
                    type="time"
                    value={settings.hours[day].close}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hours: { ...prev.hours, [day]: { ...prev.hours[day], close: e.target.value } }
                    }))}
                    disabled={!settings.hours[day].enabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DELIVERY */}
      {activeTab === "delivery" && (
        <section className="settings-section">
          <h3>Delivery Settings</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>Delivery Radius (km)</label>
              <input type="number" min="0" step="0.1" value={settings.delivery?.radius||""} onChange={e => setSettings(prev => ({...prev, delivery:{...prev.delivery, radius: e.target.value}}))} />
            </div>
            <div className="input-group">
              <label>Delivery Type</label>
              <select value={settings.delivery?.type||"free"} onChange={e => setSettings(prev => ({...prev, delivery:{...prev.delivery, type:e.target.value}}))}>
                <option value="free">Free</option>
                <option value="flat">Flat Rate</option>
                <option value="km">Per KM</option>
                <option value="postcode">Postcode Based</option>
              </select>
            </div>
            {(settings.delivery?.type==="flat" || settings.delivery?.type==="km") && (
              <div className="input-group">
                <label>{settings.delivery.type==="flat"?"Flat Rate":"Rate Per KM"}</label>
                <input type="number" min="0" step="0.01" value={settings.delivery.flatRate||""} onChange={e => setSettings(prev=>({...prev, delivery:{...prev.delivery, flatRate:e.target.value}}))} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Save */}
      <div className="save-button-container">
        <button className="save-button" onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  );
}
