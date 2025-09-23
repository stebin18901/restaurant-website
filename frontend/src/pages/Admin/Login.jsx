import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page-container">
        <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form"> {/* Added className */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
    
  );
}