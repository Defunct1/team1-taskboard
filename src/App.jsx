import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import PublicRoute from "./utils/routes/PublicRoute";
import ProtectedRoute from "./utils/routes/ProtectedRoute";
import AdminPanel from "./pages/admin/AdminPanel";
import BoardPage from "./pages/dashboard/BoardPage";
import AccountPage from "./pages/dashboard/AccountPage";
import SupportPage from "./pages/dashboard/SupportPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router basename="/team1-taskboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<h2>Головна панель</h2>} />
          <Route path="board" element={<BoardPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;