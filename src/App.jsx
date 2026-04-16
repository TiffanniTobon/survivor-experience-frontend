import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import AdminPage from "@/pages/AdminPage";
import ClassesPage from "@/pages/ClassesPage";
import CyclingMapPage from "@/pages/CyclingMapPage";
import CardioStepMapPage from "@/pages/CardioStepMapPage";

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

          {/* Rutas protegidas admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* Mapas de salones — solo admin */}
          <Route
            path="/admin/cycling-map"
            element={
              <ProtectedRoute role="admin">
                <CyclingMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cardio-step-map"
            element={
              <ProtectedRoute role="admin">
                <CardioStepMapPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
