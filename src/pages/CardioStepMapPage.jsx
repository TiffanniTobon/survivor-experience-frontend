import { useNavigate, useSearchParams } from "react-router-dom";
import RoomMap from "@/components/admin/RoomMap";

export default function CardioStepMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // classId viene en la URL: /admin/cardio-step-map?classId=5
  const classId = searchParams.get("classId");

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          background: "#040d0d",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/admin")}
            style={{
              background: "transparent",
              border: "none",
              color: "#00e5ff",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: 1,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            ← Volver al panel
          </button>

          <h1
            style={{
              color: "#e0f7fa",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 22,
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
            Estado actual de posiciones
          </p>

          {/* Mapa — solo visualización (sin onSelect) */}
          {classId ? (
            <RoomMap roomId={2} classId={classId} />
          ) : (
            <p
              style={{ color: "#ff4444", fontFamily: "'Rajdhani', sans-serif" }}
            >
              No se especificó ninguna clase.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
