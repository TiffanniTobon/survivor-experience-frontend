import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import AdminPage from "@/pages/AdminPage";
import ClassesPage from "@/pages/ClassesPage";
import CyclingMapPage from "@/pages/CyclingMapPage";
import CardioStepMapPage from "@/pages/CardioStepMapPage";
import AdminLayout from "@/layouts/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas usuario */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas admin — todas dentro del AdminLayout */}
          <Route
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/cycling-map" element={<CyclingMapPage />} />
            <Route
              path="/admin/cardio-step-map"
              element={<CardioStepMapPage />}
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
