import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useIsMobile from "@/hooks/useIsMobile";

const NAV_ITEMS = [
  { label: "Cronograma", tab: "classes", path: "/classes" },
  { label: "Mis Reservas", tab: "reservations", path: "/reservations" },
];

export default function UserSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getActiveTab = () => {
    if (location.pathname.includes("reservations")) return "reservations";
    return "classes";
  };

  const activeTab = getActiveTab();

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
          El mejor gym de Buenos Aires
        </p>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(({ label, tab, path }) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => navigate(path)}
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                background: isActive ? "#00e5ff18" : "transparent",
                borderLeft: isActive
                  ? "3px solid #00e5ff"
                  : "3px solid transparent",
                color: isActive ? "#00e5ff" : "#336666",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: 1,
                transition: "all 0.15s",
              }}
            >
              {label}
            </div>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div style={{ padding: "0 16px" }}>
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
