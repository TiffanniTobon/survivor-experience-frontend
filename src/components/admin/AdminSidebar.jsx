import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useIsMobile from "@/hooks/useIsMobile";

const NAV_ITEMS = [
  { label: "Gestión de Clases", active: true },
  { label: "Cycling Map", active: false },
  { label: "Cardio Step Map", active: false },
];

// Recibe onCreateClass para abrir el modal desde AdminPage
export default function AdminSidebar({ onCreateClass, disableCreate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // En móvil el sidebar no se muestra
  if (isMobile) return null;

  return (
    <aside
      style={{
        width: 220,
        background: "#060f0f",
        borderRight: "1px solid #0a2a2a",
        display: "flex",
        flexDirection: "column",
        padding: "28px 0",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 24px 28px" }}>
        <p
          style={{
            color: "#00e5ff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          SURVIVOR
          <br />
          EXPERIENCE
        </p>
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 11,
            letterSpacing: 3,
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          ADMIN DASHBOARD
        </p>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(({ label, active }) => (
          <div
            key={label}
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              background: active ? "#00e5ff18" : "transparent",
              borderLeft: active
                ? "3px solid #00e5ff"
                : "3px solid transparent",
              color: active ? "#00e5ff" : "#336666",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              letterSpacing: 1,
            }}
          >
            {label}
          </div>
        ))}
      </nav>

      {/* Parte inferior */}
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={onCreateClass}
          disabled={disableCreate}
          style={{
            background: "#00e5ff",
            border: "none",
            color: "#040d0d",
            borderRadius: 6,
            padding: "10px 0",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: "pointer",
            width: "100%",
            opacity: disableCreate ? 0.3 : 1,
            cursor: disableCreate ? "not-allowed" : "pointer",
          }}
        >
          + CREAR CLASE
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #1a3a3a",
            color: "#336666",
            borderRadius: 6,
            padding: "9px 0",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: 1,
            width: "100%",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
