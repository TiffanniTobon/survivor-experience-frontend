import { useNavigate, useSearchParams } from "react-router-dom";
import RoomMap from "@/components/admin/RoomMap";

export default function CardioStepMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // classId viene en la URL: /admin/cardio-step-map?classId=5
  const classId = searchParams.get("classId");

  return (
    <>
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
