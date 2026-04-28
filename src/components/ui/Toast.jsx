import { useEffect } from "react";

// Tipos de toast: "success" | "error"
const STYLES = {
  success: {
    background: "linear-gradient(90deg, #00e5ff, #00b8cc)",
    color: "#040d0d",
  },
  error: {
    background: "linear-gradient(90deg, #ff4444, #cc2222)",
    color: "#fff",
  },
};

// Recibe:
// message → texto a mostrar
// type    → "success" | "error"
// onClose → función para cerrarlo
// duration → duración en ms (default 3000)
export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  // Se cierra automáticamente después de `duration` ms
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90, // por encima de la bottom bar en móvil
        right: 20,
        zIndex: 200,
        padding: "12px 20px",
        borderRadius: 10,
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 1,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        ...STYLES[type],
      }}
    >
      {message}
    </div>
  );
}
