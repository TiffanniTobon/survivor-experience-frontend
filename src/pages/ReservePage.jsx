import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import RoomMap from "@/components/admin/RoomMap";
import { createReservationRequest } from "@/services/reservationService";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useIsMobile from "@/hooks/useIsMobile";

export default function ReservePage() {
  const { classId } = useParams();
  const [searchParams] = useSearchParams();
  const roomId = parseInt(searchParams.get("roomId"));
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const roomName = roomId === 1 ? "Cycling" : "Cardio Step";

  const handleSelect = (position) => {
    setSelectedPosition(position);
  };

  const handleReserve = async () => {
    if (!selectedPosition) {
      showToast("Selecciona una posición primero.", "error");
      return;
    }
    setLoading(true);
    try {
      await createReservationRequest(classId, selectedPosition.id);
      showToast("¡Reserva realizada correctamente!");
      setTimeout(() => navigate("/reservations"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Position is already taken") {
        showToast("Esa posición ya fue reservada.", "error");
      } else if (msg === "You already have a reservation for this class") {
        showToast("Ya tienes una reserva para esta clase.", "error");
      } else {
        showToast("Error al reservar. Intenta de nuevo.", "error");
      }
    } finally {
      setLoading(false);
    }
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
            WELLNESS CENTER
          </p>
        </div>
      )}
      {/* Botón volver */}
      <button
        onClick={() => navigate("/classes")}
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
        ← Volver al cronograma
      </button>
      {/* Encabezado */}
      <div style={{ marginBottom: 32 }}>
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
          Reserva — {roomName}
        </h1>
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            letterSpacing: 2,
            marginTop: 6,
            marginBottom: 0,
          }}
        >
          Selecciona tu posición para esta clase
        </p>
      </div>
      {/* Mapa — con onSelect para que sea interactivo */}
      <RoomMap roomId={roomId} classId={classId} onSelect={handleSelect} />
      {/* Posición seleccionada + botón reservar */}
      {selectedPosition && (
        <div
          style={{
            marginTop: 32,
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
            <strong>{String(selectedPosition.number).padStart(2, "0")}</strong>
          </p>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
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
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "RESERVANDO..." : "CONFIRMAR RESERVA"}
          </button>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        title="¿Confirmar reserva?"
        message={`Vas a reservar la posición ${String(selectedPosition?.number || "").padStart(2, "0")} en ${roomName}. Esta acción bloqueará ese lugar para ti.`}
        confirmLabel="Confirmar reserva"
        confirmColor="primary"
        onConfirm={handleReserve}
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
