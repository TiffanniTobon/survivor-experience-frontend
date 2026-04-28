const BUTTON_COLORS = {
  danger: {
    background: "#2a0a0a",
    border: "1px solid #ff4444",
    color: "#ff4444",
  },
  primary: {
    background: "#00e5ff",
    border: "none",
    color: "#040d0d",
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  confirmColor = "danger",
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  const btnStyle = BUTTON_COLORS[confirmColor] || BUTTON_COLORS.danger;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          background: "#061212",
          border: "1px solid #00e5ff33",
          borderRadius: 12,
          padding: 32,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 0 40px #00e5ff11",
        }}
      >
        {/* Título */}
        <h2
          style={{
            color: "#e0f7fa",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            margin: "0 0 12px",
          }}
        >
          {title}
        </h2>

        {/* Mensaje */}
        <p
          style={{
            color: "#336666",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 14,
            letterSpacing: 1,
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "transparent",
              border: "1px solid #1a3a3a",
              color: "#888",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 11,
              letterSpacing: 1,
            }}
          >
            CANCELAR
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 11,
              letterSpacing: 1,
              fontWeight: 700,
              ...btnStyle,
            }}
          >
            {confirmLabel.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
