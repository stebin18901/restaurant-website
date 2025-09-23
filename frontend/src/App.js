import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderPage from "./pages/Customer/OrderPage";
import OrdersList from "./pages/Admin/OrdersList";
import OrderDetail from "./pages/Admin/OrderDetail";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminItems from "./pages/Admin/AdminItems";
import AdminEditItem from "./pages/Admin/AdminEditItem";
import AdminSettings from "./pages/Admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/" element={<OrderPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items/:id/edit"
          element={
            <ProtectedRoute>
              <AdminEditItem />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/items"
          element={
            <ProtectedRoute>
              <AdminItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
