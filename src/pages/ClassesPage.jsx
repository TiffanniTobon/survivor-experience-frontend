import { useState, useEffect } from "react";
import WeekNavigator from "@/components/admin/WeekNavigator";
import useIsMobile from "@/hooks/useIsMobile";
import {
  getMondayOfWeek,
  getWeekDays,
  toISODate,
  getStatus,
  ROOMS,
  STATUS_COLORS,
} from "@/utils/classHelpers";
import { getClassesRequest } from "@/services/classService";
import { useNavigate } from "react-router-dom";
import { getMyReservationsRequest } from "@/services/reservationService";

export default function ClassesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myReservations, setMyReservations] = useState([]);

  const monday = getMondayOfWeek(weekOffset);
  const weekDays = getWeekDays(monday);
  const selectedDate = weekDays[selectedDayIndex];

  //Estados
  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const res = await getMyReservationsRequest();
        setMyReservations(res.data || []);
      } catch {
        // silencioso — no bloqueamos el cronograma si falla
      }
    };
    fetchMyReservations();
  }, []);

  const hasReservation = (classId) =>
    myReservations.some((r) => r.class_id === classId);

  // ─── FETCH ────────────────────────────────────────────────────────────
  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getClassesRequest(toISODate(monday));
      setClasses(res.data || []);
    } catch {
      setError("No se pudieron cargar las clases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [weekOffset]);

  const classesForDay = classes.filter(
    (c) => c.date === toISODate(selectedDate),
  );

  // ─── RENDER TABLA DESKTOP ─────────────────────────────────────────────
  const renderDesktop = () => (
    <div
      style={{
        background: "#060f0f",
        border: "1px solid #0a2a2a",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 13% 22% 15% 16% 24%",
          padding: "14px 24px",
          borderBottom: "1px solid #0a2a2a",
        }}
      >
        {["HORA", "CLASE", "INSTRUCTOR", "SALÓN", "ESTADO", ""].map((h) => (
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
        ))}
      </div>

      {classesForDay.length === 0 ? (
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
      ) : (
        classesForDay.map((cls, i) => {
          const status = getStatus(cls.date, cls.start_time, cls.end_time);
          const sc = STATUS_COLORS[status];
          const canReserve =
            (cls.room_id === 1 || cls.room_id === 2) &&
            status !== "Finalizada" &&
            !hasReservation(cls.id);

          return (
            <div
              key={cls.id}
              style={{
                display: "grid",
                gridTemplateColumns: "10% 13% 22% 15% 16% 24%",
                padding: "16px 24px",
                borderBottom:
                  i < classesForDay.length - 1 ? "1px solid #0a2a2a" : "none",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#0a1a1a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
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
                  display: "inline-block",
                  width: "fit-content",
                }}
              >
                {status}
              </span>
              <div>
                {(cls.room_id === 1 || cls.room_id === 2) &&
                  status !== "Finalizada" &&
                  (hasReservation(cls.id) ? (
                    <button
                      onClick={() => navigate("/reservations")}
                      style={{
                        background: "#0a2e1a",
                        border: "1px solid #00ff88",
                        color: "#00ff88",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      RESERVADA
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/reserve/${cls.id}?roomId=${cls.room_id}`)
                      }
                      style={{
                        background: "#00e5ff",
                        border: "none",
                        color: "#040d0d",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      RESERVAR
                    </button>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // ─── RENDER TARJETAS MÓVIL ────────────────────────────────────────────
  const renderMobile = () => (
    <div
      style={{
        background: "#060f0f",
        border: "1px solid #0a2a2a",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 80,
      }}
    >
      {classesForDay.length === 0 ? (
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
      ) : (
        classesForDay.map((cls) => {
          const status = getStatus(cls.date, cls.start_time, cls.end_time);
          const sc = STATUS_COLORS[status];
          const canReserve =
            (cls.room_id === 1 || cls.room_id === 2) &&
            status !== "Finalizada" &&
            !hasReservation(cls.id);

          return (
            <div
              key={cls.id}
              style={{ padding: "16px", borderBottom: "1px solid #0a2a2a" }}
            >
              {/* Fila superior */}
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
              {/* Fila inferior */}
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
                {(cls.room_id === 1 || cls.room_id === 2) &&
                  status !== "Finalizada" &&
                  (hasReservation(cls.id) ? (
                    <button
                      onClick={() => navigate("/reservations")}
                      style={{
                        background: "#0a2e1a",
                        border: "1px solid #00ff88",
                        color: "#00ff88",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      RESERVADA
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/reserve/${cls.id}?roomId=${cls.room_id}`)
                      }
                      style={{
                        background: "#00e5ff",
                        border: "none",
                        color: "#040d0d",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      RESERVAR
                    </button>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // ─── RENDER PRINCIPAL ─────────────────────────────────────────────────
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
          Cronograma Semanal
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
          Clases disponibles esta semana
        </p>
      </div>

      <WeekNavigator
        monday={monday}
        weekDays={weekDays}
        selectedDayIndex={selectedDayIndex}
        classes={classes}
        onPrevWeek={() => setWeekOffset((w) => w - 1)}
        onNextWeek={() => setWeekOffset((w) => w + 1)}
        onSelectDay={setSelectedDayIndex}
      />

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
      ) : error ? (
        <p style={{ color: "#ff4444", fontFamily: "'Rajdhani', sans-serif" }}>
          {error}
        </p>
      ) : isMobile ? (
        renderMobile()
      ) : (
        renderDesktop()
      )}
    </div>
  );
}
