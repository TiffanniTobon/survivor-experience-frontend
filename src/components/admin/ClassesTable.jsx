import { ROOMS, STATUS_COLORS, getStatus } from "@/utils/classHelpers";
import useIsMobile from "@/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

const IconMap = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
  </svg>
);

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconDelete = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

// ── Vista móvil: tarjetas ─────────────────────────────────────────────
function ClassCard({ cls, onEdit, onDelete }) {
  const navigate = useNavigate();
  const status = getStatus(cls.date, cls.start_time, cls.end_time);
  const sc = STATUS_COLORS[status];

  const handleViewMap = () => {
    const route =
      cls.room_id === 1
        ? `/admin/cycling-map?classId=${cls.id}`
        : `/admin/cardio-step-map?classId=${cls.id}`;
    navigate(route);
  };

  return (
    <div
      style={{
        padding: "16px",
        borderBottom: "1px solid #0a2a2a",
      }}
    >
      {/* Fila superior: hora + nombre + estado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: "#00e5ff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {cls.start_time.slice(0, 5)}
        </span>

        <span
          style={{
            color: "#e0f7fa",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1,
            flex: 1,
          }}
        >
          {cls.name}
        </span>

        <span
          style={{
            background: sc.bg,
            color: sc.text,
            border: `1px solid ${sc.border}`,
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {status}
        </span>
      </div>

      {/* Fila inferior: instructor + salón + acciones */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            flex: 1,
          }}
        >
          {cls.instructor} · {ROOMS[cls.room_id] || "—"}
        </span>

        {/* Ver mapa — solo Cycling y Cardio Step */}
        {(cls.room_id === 1 || cls.room_id === 2) && (
          <button
            onClick={handleViewMap}
            style={{
              background: "#0a1a2a",
              border: "1px solid #1a4a6a",
              color: "#00e5ff",
              borderRadius: 4,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <IconMap />
          </button>
        )}
        {status !== "Finalizada" && (
          <>
            <button
              onClick={() => onEdit(cls)}
              style={{
                background: "#0a2a2a",
                border: "1px solid #1a4a4a",
                color: "#00e5ff",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <IconEdit />
            </button>

            <button
              onClick={() => onDelete(cls.id)}
              style={{
                background: "#2a0a0a",
                border: "1px solid #4a1a1a",
                color: "#ff4444",
                borderRadius: 4,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <IconDelete />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Vista desktop: tabla ──────────────────────────────────────────────
function ClassRow({ cls, onEdit, onDelete, isLast }) {
  const navigate = useNavigate();
  const status = getStatus(cls.date, cls.start_time, cls.end_time);
  const sc = STATUS_COLORS[status];

  // Navega al mapa según el salón de la clase
  const handleViewMap = () => {
    const route =
      cls.room_id === 1
        ? `/admin/cycling-map?classId=${cls.id}`
        : `/admin/cardio-step-map?classId=${cls.id}`;
    navigate(route);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10% 13% 22% 15% 16% 24%",
        padding: "16px 24px",
        borderBottom: isLast ? "none" : "1px solid #0a2a2a",
        alignItems: "center",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0a1a1a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span
        style={{
          color: "#e0f7fa",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {cls.start_time.slice(0, 5)}
      </span>
      <span
        style={{
          color: "#e0f7fa",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {cls.name}
      </span>
      <span
        style={{
          color: "#88bbbb",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
        }}
      >
        {cls.instructor}
      </span>
      <span
        style={{
          color: "#88bbbb",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
        }}
      >
        {ROOMS[cls.room_id] || "—"}
      </span>
      <span
        style={{
          background: sc.bg,
          color: sc.text,
          border: `1px solid ${sc.border}`,
          borderRadius: 20,
          padding: "4px 12px",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1,
          display: "inline-block",
          width: "fit-content",
        }}
      >
        {status}
      </span>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-start" }}>
        {(cls.room_id === 1 || cls.room_id === 2) && (
          <button
            onClick={handleViewMap}
            style={{
              background: "#0a1a2a",
              border: "1px solid #1a4a6a",
              color: "#00e5ff",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
            }}
          >
            Ver mapa
          </button>
        )}
        {status !== "Finalizada" && (
          <>
            <button
              onClick={() => onEdit(cls)}
              style={{
                background: "#0a2a2a",
                border: "1px solid #1a4a4a",
                color: "#00e5ff",
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 12,
              }}
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(cls.id)}
              style={{
                background: "#2a0a0a",
                border: "1px solid #4a1a1a",
                color: "#ff4444",
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 12,
              }}
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────
export default function ClassesTable({
  classes,
  loading,
  error,
  onEdit,
  onDelete,
}) {
  const isMobile = useIsMobile();

  if (loading)
    return (
      <p
        style={{
          color: "#336666",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: 2,
          fontSize: 14,
        }}
      >
        Cargando clases...
      </p>
    );

  if (error)
    return (
      <p style={{ color: "#ff4444", fontFamily: "'Rajdhani', sans-serif" }}>
        {error}
      </p>
    );

  return (
    <div
      style={{
        background: "#060f0f",
        border: "1px solid #0a2a2a",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: isMobile ? 80 : 0,
      }}
    >
      {/* Cabecera — solo desktop */}
      {!isMobile && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10% 13% 22% 15% 16% 24%",
            padding: "14px 24px 14px 24px",
            borderBottom: "1px solid #0a2a2a",
          }}
        >
          {["HORA", "CLASE", "INSTRUCTOR", "SALÓN", "ESTADO", "ACCIONES"].map(
            (h) => (
              <span
                key={h}
                style={{
                  color: "#336666",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 10,
                  letterSpacing: 2,
                }}
              >
                {h}
              </span>
            ),
          )}
        </div>
      )}

      {/* Sin clases */}
      {classes.length === 0 ? (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 14,
            letterSpacing: 2,
          }}
        >
          No hay clases programadas para este día
        </div>
      ) : isMobile ? (
        // Tarjetas en móvil
        classes.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        // Tabla en desktop
        classes.map((cls, i) => (
          <ClassRow
            key={cls.id}
            cls={cls}
            onEdit={onEdit}
            onDelete={onDelete}
            isLast={i === classes.length - 1}
          />
        ))
      )}
    </div>
  );
}
