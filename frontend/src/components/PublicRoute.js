// components/PublicRoute.js
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ If user is authenticated, redirect to intended page or orders
  if (token) {
    const from = location.state?.from?.pathname || "/admin/orders";
    return <Navigate to={from} replace />;
  }

  return children;
}