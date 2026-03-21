import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// role: "admin" | "user" | undefined (cualquiera autenticado)
export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (role && user?.role !== role) return <Navigate to="/classes" replace />;

  return children;
}