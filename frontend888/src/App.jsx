import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

// Layout
import MainLayout from "./layout/MainLayout";

// ================= PRIVATE ROUTE =================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // 🔥 IMPORTANT FIX: prevent going back after logout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ================= */}

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <PrivateRoute>
              <MainLayout>
                <POS />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <MainLayout>
                <Products />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MainLayout>
                <Orders />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 🔥 FIXED FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;