import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";

// Placeholders — los crearemos en próximos pasos
const ClassesPage = () => <div className="text-white p-8">Clases (próximo)</div>;
const AdminPage   = () => <div className="text-white p-8">Admin (próximo)</div>;

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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
