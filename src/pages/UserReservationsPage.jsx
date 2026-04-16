import { useState, useEffect } from "react";
import {
  getMyReservationsRequest,
  cancelReservationRequest,
} from "@/services/reservationService";
import useIsMobile from "@/hooks/useIsMobile";
import Toast from "@/components/ui/Toast";
import { ROOMS } from "@/utils/classHelpers";

export default function UserReservationsPage() {
  const isMobile = useIsMobile();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyReservationsRequest();
      setReservations(res.data || []);
    } catch {
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    try {
      await cancelReservationRequest(id);
      showToast("Reserva cancelada correctamente", "error");
      await fetchReservations();
    } catch {
      showToast("Error al cancelar la reserva.", "error");
    }
  };

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

  return (
    <div style={{ padding: isMobile ? "24px 16px 100px" : "40px 48px" }}>
      {/* Logo — solo móvil */}
      {isMobile && (
        <div style={{ marginBottom: 20 }}>
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
            SURVIVOR EXPERIENCE
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
      )}

      {/* Encabezado */}
      <div style={{ marginBottom: isMobile ? 20 : 32 }}>
        <h1
          style={{
            color: "#e0f7fa",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: isMobile ? 18 : 24,
            fontWeight: 700,
            letterSpacing: isMobile ? 2 : 3,
            margin: 0,
          }}
        >
          Mis Reservas
        </h1>
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            letterSpacing: 2,
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Tus clases reservadas activas
        </p>
      </div>

      {loading ? (
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 2,
          }}
        >
          Cargando reservas...
        </p>
      ) : error ? (
        <p style={{ color: "#ff4444", fontFamily: "'Rajdhani', sans-serif" }}>
          {error}
        </p>
      ) : reservations.length === 0 ? (
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
          No tienes reservas activas
        </div>
      ) : (
        <div
          style={{
            background: "#060f0f",
            border: "1px solid #0a2a2a",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {reservations.map((r, i) => (
            <div
              key={r.id}
              style={{
                padding: "20px 24px",
                borderBottom:
                  i < reservations.length - 1 ? "1px solid #0a2a2a" : "none",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#0a1a1a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Info de la clase */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#e0f7fa",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  {r.class_name}
                </p>
                <p
                  style={{
                    color: "#336666",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  {formatDate(r.date)} · {r.start_time.slice(0, 5)} –{" "}
                  {r.end_time.slice(0, 5)}
                </p>
                <p
                  style={{
                    color: "#336666",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 13,
                    margin: "2px 0 0",
                  }}
                >
                  {r.instructor} · {r.room_name} · Posición {r.position_number}
                </p>
              </div>

              {/* Botón cancelar */}
              <button
                onClick={() => handleCancel(r.id)}
                style={{
                  background: "#2a0a0a",
                  border: "1px solid #4a1a1a",
                  color: "#ff4444",
                  borderRadius: 6,
                  padding: isMobile ? "6px 12px" : "6px 16px",
                  cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
