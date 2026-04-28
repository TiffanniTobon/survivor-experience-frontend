import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomMap from "@/components/admin/RoomMap";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import { getClassesRequest } from "@/services/classService";
import { createReservationRequest } from "@/services/reservationService";
import {
  getMondayOfWeek,
  toISODate,
  getStatus,
  STATUS_COLORS,
} from "@/utils/classHelpers";
import useIsMobile from "@/hooks/useIsMobile";

const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

export default function CardioStepMapPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const monday = getMondayOfWeek(0);
        const res = await getClassesRequest(toISODate(monday));
        const cardio = (res.data || []).filter((c) => c.room_id === 2);
        setClasses(cardio);
      } catch {
        showToast("No se pudieron cargar las clases.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setSelectedPosition(null);
  };

  const handleSelectPosition = (position) => {
    setSelectedPosition(position);
  };

  const handleBlock = async () => {
    try {
      await createReservationRequest(selectedClass.id, selectedPosition.id);
      showToast("Posición bloqueada correctamente");
      setSelectedPosition(null);
      setSelectedClass({ ...selectedClass });
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Position is already taken") {
        showToast("Esa posición ya está ocupada.", "error");
      } else if (msg === "You already have a reservation for this class") {
        showToast("Ya bloqueaste una posición en esta clase.", "error");
      } else {
        showToast("Error al bloquear. Intenta de nuevo.", "error");
      }
    }
  };

  return (
    <div style={{ padding: isMobile ? "24px 16px 100px" : "40px 48px" }}>
      <button
        onClick={() => navigate("/admin")}
        style={{
          background: "#0a2a2a",
          border: "1px solid #1a4a4a",
          color: "#00e5ff",
          borderRadius: 8,
          padding: "8px 16px",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1,
          cursor: "pointer",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        ← Volver al panel
      </button>

      <h1
        style={{
          color: "#e0f7fa",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? 18 : 22,
          fontWeight: 700,
          letterSpacing: 3,
          margin: 0,
        }}
      >
        Cardio Step Map
      </h1>
      <p
        style={{
          color: "#336666",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 13,
          letterSpacing: 2,
          marginTop: 6,
          marginBottom: 32,
        }}
      >
        Selecciona una clase para ver y gestionar posiciones
      </p>

      {loading ? (
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 2,
          }}
        >
          Cargando clases...
        </p>
      ) : classes.length === 0 ? (
        <div
          style={{
            background: "#060f0f",
            border: "1px solid #0a2a2a",
            borderRadius: 10,
            padding: "40px 24px",
            textAlign: "center",
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 14,
            letterSpacing: 2,
          }}
        >
          No hay clases de Cardio Step programadas esta semana
        </div>
      ) : (
        <div
          style={{
            background: "#060f0f",
            border: "1px solid #0a2a2a",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          {classes.map((cls, i) => {
            const status = getStatus(cls.date, cls.start_time, cls.end_time);
            const sc = STATUS_COLORS[status];
            const isSelected = selectedClass?.id === cls.id;
            const isFinalizada = status === "Finalizada";

            return (
              <div
                key={cls.id}
                style={{
                  padding: "16px 24px",
                  borderBottom:
                    i < classes.length - 1 ? "1px solid #0a2a2a" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: isSelected ? "#0a2a2a" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "#e0f7fa",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      margin: "0 0 4px",
                    }}
                  >
                    {cls.start_time.slice(0, 5)} — {cls.name}
                  </p>
                  <p
                    style={{
                      color: "#336666",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    {formatDate(cls.date)} · {cls.instructor}
                  </p>
                </div>

                <span
                  style={{
                    background: sc.bg,
                    color: sc.text,
                    border: `1px solid ${sc.border}`,
                    borderRadius: 20,
                    padding: "3px 12px",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {status}
                </span>

                {!isFinalizada && (
                  <button
                    onClick={() => handleSelectClass(cls)}
                    style={{
                      background: isSelected ? "#00e5ff" : "#0a2a2a",
                      border: `1px solid ${isSelected ? "#00e5ff" : "#1a4a4a"}`,
                      color: isSelected ? "#040d0d" : "#00e5ff",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected ? "SELECCIONADA" : "VER MAPA"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedClass && (
        <>
          <h2
            style={{
              color: "#e0f7fa",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 14,
              letterSpacing: 2,
              marginBottom: 24,
            }}
          >
            MAPA — {selectedClass.name} {selectedClass.start_time.slice(0, 5)}
          </h2>

          <RoomMap
            roomId={2}
            classId={selectedClass.id}
            onSelect={handleSelectPosition}
          />

          {selectedPosition && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  color: "#00e5ff",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Posición seleccionada:{" "}
                <strong>
                  {String(selectedPosition.number).padStart(2, "0")}
                </strong>
              </p>
              <button
                onClick={() => setConfirmOpen(true)}
                style={{
                  background: "#00e5ff",
                  border: "none",
                  color: "#040d0d",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                BLOQUEAR POSICIÓN
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="¿Bloquear posición?"
        message={`La posición ${String(selectedPosition?.number || "").padStart(2, "0")} quedará ocupada y no estará disponible para los usuarios.`}
        confirmLabel="Bloquear"
        confirmColor="primary"
        onConfirm={handleBlock}
        onClose={() => setConfirmOpen(false)}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
