import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const IconClases = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const IconReservations = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
  </svg>
);

const IconSalir = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

export default function UserBottomBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getActiveTab = () => {
    if (location.pathname.includes("reservations")) return "reservations";
    return "classes";
  };

  const activeTab = getActiveTab();

  const tabStyle = (tab) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "8px 0",
    flex: 1,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: activeTab === tab ? "#00e5ff" : "#336666",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 10,
    letterSpacing: 1,
    transition: "color 0.15s",
  });

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#060f0f",
        borderTop: "1px solid #0a2a2a",
        display: "flex",
        alignItems: "center",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Cronograma */}
      <button onClick={() => navigate("/classes")} style={tabStyle("classes")}>
        <IconClases />
        <span>Cronograma</span>
      </button>

      {/* Mis Reservas */}
      <button
        onClick={() => navigate("/reservations")}
        style={tabStyle("reservations")}
      >
        <IconReservations />
        <span>Mis reservas</span>
      </button>

      {/* Cerrar sesión */}
      <button onClick={handleLogout} style={tabStyle(null)}>
        <IconSalir />
        <span>Salir</span>
      </button>
    </nav>
  );
}
