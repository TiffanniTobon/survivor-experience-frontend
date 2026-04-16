import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Íconos SVG inline para no depender de librerías externas
const IconClases = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const IconCycling = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
  </svg>
);

const IconCardio = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
  </svg>
);

const IconCrear = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const IconSalir = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

// Recibe:
// activeTab    → pestaña activa: "clases" | "cycling" | "cardio"
// onCreateClass → abre el modal de crear clase
export default function AdminBottomBar({
  activeTab,
  onCreateClass,
  disableCreate,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        paddingBottom: "env(safe-area-inset-bottom)", // respeta el notch en iOS
      }}
    >
      {/* Gestión de Clases */}
      <button onClick={() => navigate("/admin")} style={tabStyle("clases")}>
        <IconClases />
        <span>Clases</span>
      </button>

      {/* Cycling Map */}
      <button
        onClick={() => navigate("/admin/cycling-map")}
        style={tabStyle("cycling")}
      >
        <IconCycling />
        <span>Cycling</span>
      </button>

      {/* Cardio Step Map */}
      <button
        onClick={() => navigate("/admin/cardio-step-map")}
        style={tabStyle("cardio")}
      >
        <IconCardio />
        <span>Cardio</span>
      </button>

      {/* Crear clase — botón destacado en cyan */}
      <button
        onClick={disableCreate ? undefined : onCreateClass}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "8px 0",
          flex: 1,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#00e5ff",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 10,
          letterSpacing: 1,
          opacity: disableCreate ? 0.3 : 1,
          cursor: disableCreate ? "not-allowed" : "pointer",
        }}
      >
        {/* Círculo destacado para el botón de crear */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#00e5ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -18, // lo eleva por encima de la barra
            boxShadow: "0 0 16px #00e5ff88",
            color: "#040d0d",
          }}
        >
          <IconCrear />
        </div>
        <span style={{ marginTop: 2 }}>Crear</span>
      </button>

      {/* Cerrar sesión */}
      <button onClick={handleLogout} style={tabStyle(null)}>
        <IconSalir />
        <span>Salir</span>
      </button>
    </nav>
  );
}
