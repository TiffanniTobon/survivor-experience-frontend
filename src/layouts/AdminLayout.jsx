import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useIsMobile from "@/hooks/useIsMobile";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBottomBar from "@/components/admin/AdminBottomBar";

// AdminLayout envuelve todas las páginas del panel de admin
// Outlet renderiza la página activa (AdminPage, CyclingMapPage, etc.)
export default function AdminLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Determina qué tab está activo según la URL actual
  const getActiveTab = () => {
    if (location.pathname.includes("cycling-map")) return "cycling";
    if (location.pathname.includes("cardio-step-map")) return "cardio";
    return "clases";
  };

  const handleCreateClass = () => navigate("/admin?action=create");

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{ display: "flex", minHeight: "100vh", background: "#040d0d" }}
      >
        {/* Sidebar — solo desktop */}
        <AdminSidebar
          onCreateClass={handleCreateClass}
          activeTab={getActiveTab()}
        />

        {/* Contenido de la página activa */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Barra inferior — solo móvil */}
      {isMobile && (
        <AdminBottomBar
          activeTab={getActiveTab()}
          onCreateClass={handleCreateClass}
        />
      )}
    </>
  );
}
