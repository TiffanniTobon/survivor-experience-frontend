import { useState, useEffect } from "react";
import { getPositionsRequest } from "@/services/positionService";
import useIsMobile from "@/hooks/useIsMobile";

// Íconos SVG inline
// Bicicleta — para Cycling (room_id 1)
const IconBike = ({ size = 28, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
  </svg>
);

// Patinaje — para Cardio Step (room_id 2)
const IconSkate = ({ size = 28, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
  </svg>
);

// Colores según estado de la posición
const POSITION_COLORS = {
  free: { bg: "#0a2e1a", border: "#00ff88", icon: "#00ff88" },
  occupied: { bg: "#2e0a0a", border: "#ff4444", icon: "#ff4444" },
  selected: { bg: "#002a40", border: "#00e5ff", icon: "#00e5ff" },
};

// Recibe:
// roomId      → 1=Cycling, 2=Cardio Step
// classId     → id de la clase para cargar el estado de reservas
// onSelect    → función que se llama cuando el usuario selecciona una posición
//               si es undefined, el mapa es solo de visualización (modo admin)
export default function RoomMap({ roomId, classId, onSelect }) {
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Ícono según el salón
  const Icon = roomId === 1 ? IconBike : IconSkate;

  // ─── FETCH ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!classId) return;
    const fetchPositions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPositionsRequest(roomId, classId);
        setPositions(res.data || []);
      } catch {
        setError("No se pudieron cargar las posiciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, [roomId, classId]);

  // ─── SELECCIÓN ────────────────────────────────────────────────────────
  // Solo aplica cuando onSelect está definido (vista usuario)
  const handleSelect = (position) => {
    if (position.status === "occupied") return; // no se puede seleccionar ocupada
    if (!onSelect) return; // en modo admin no se puede seleccionar
    setSelectedId(position.id);
    onSelect(position);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────
  if (loading)
    return (
      <p
        style={{
          color: "#336666",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: 2,
        }}
      >
        Cargando mapa...
      </p>
    );

  if (error)
    return (
      <p style={{ color: "#ff4444", fontFamily: "'Rajdhani', sans-serif" }}>
        {error}
      </p>
    );

  // Organizamos las posiciones en filas de 5 columnas
  // Ej: [1,2,3,4,5], [6,7,8,9,10], ...
  const COLUMNS = 5;
  const rows = [];
  for (let i = 0; i < positions.length; i += COLUMNS) {
    rows.push(positions.slice(i, i + COLUMNS));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Leyenda */}
      <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
        {[
          { label: "Libre", color: "#00ff88" },
          { label: "Ocupada", color: "#ff4444" },
          ...(onSelect ? [{ label: "Seleccionada", color: "#00e5ff" }] : []),
        ].map(({ label, color }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
              }}
            />
            <span
              style={{
                color: "#88bbbb",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 13,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Posición del instructor — centrada arriba */}
      <div
        style={{
          background: "#1a1a2e",
          border: "1px solid #336666",
          borderRadius: 8,
          padding: "8px 24px",
          marginBottom: 8,
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 10,
          letterSpacing: 2,
          color: "#336666",
        }}
      >
        ESCENARIO INSTRUCTOR
      </div>

      {/* Grilla de posiciones */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 6 : 10,
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", gap: isMobile ? 6 : 10 }}
          >
            {row.map((position) => {
              const isSelected = selectedId === position.id;
              const colorKey = isSelected ? "selected" : position.status;
              const colors = POSITION_COLORS[colorKey];
              const isClickable = onSelect && position.status !== "occupied";

              return (
                <div
                  key={position.id}
                  onClick={() => handleSelect(position)}
                  style={{
                    width: isMobile ? 44 : 56,
                    height: isMobile ? 44 : 56,
                    background: colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isClickable ? "pointer" : "default",
                    transition: "all 0.15s",
                    gap: 2,
                  }}
                >
                  <Icon size={isMobile ? 18 : 22} color={colors.icon} />
                  <span
                    style={{
                      color: colors.icon,
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {String(position.number).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
