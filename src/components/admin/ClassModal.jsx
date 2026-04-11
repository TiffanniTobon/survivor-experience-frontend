import { useState, useEffect } from "react";

const EMPTY_FORM = {
  name: "",
  instructor: "",
  room_id: "1",
  date: "",
  start_time: "",
  end_time: "",
};

const inputStyle = {
  background: "#0a1a1a",
  border: "1px solid #1a3a3a",
  color: "#e0f7fa",
  borderRadius: 6,
  padding: "8px 12px",
  width: "100%",
  outline: "none",
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 15,
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#00e5ff",
  fontSize: 11,
  letterSpacing: 2,
  textTransform: "uppercase",
  fontFamily: "'Orbitron', sans-serif",
  marginBottom: 4,
  display: "block",
};

// Recibe:
// isOpen   → boolean para mostrar u ocultar el modal
// onClose  → función para cerrar el modal
// onSave   → función async que recibe el form y llama al backend
// initial  → datos de la clase a editar (null si es crear)

export default function ClassModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cuando se abre el modal: si hay datos iniciales los cargamos (editar),
  // si no limpiamos el formulario (crear)
  useEffect(() => {
    if (isOpen) {
      setForm(initial || EMPTY_FORM);
      setError("");
    }
  }, [isOpen, initial]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.instructor ||
      !form.date ||
      !form.start_time ||
      !form.end_time
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Validación de fecha y hora
      const now = new Date();
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // La fecha no puede ser anterior a hoy
      if (selectedDate < today) {
        setError("No puedes crear clases en días pasados.");
        return;
      }

      // La hora de inicio debe ser al menos 1 hora mayor a la hora actual
      const startDateTime = new Date(`${form.date}T${form.start_time}`);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (startDateTime < oneHourFromNow) {
        setError(
          "La hora de inicio debe ser al menos 1 hora mayor a la hora actual.",
        );
        return;
      }

      // La hora de fin debe ser mayor a la de inicio
      if (form.end_time <= form.start_time) {
        setError("La hora de fin debe ser mayor a la hora de inicio.");
        return;
      }
      await onSave(form);
      onClose();
    } catch {
      setError("Error al guardar la clase. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#061212",
          border: "1px solid #00e5ff33",
          borderRadius: 12,
          padding: 32,
          width: 440,
          boxShadow: "0 0 40px #00e5ff22",
        }}
      >
        {/* Título */}
        <h2
          style={{
            color: "#00e5ff",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 16,
            marginBottom: 24,
            letterSpacing: 2,
            marginTop: 0,
          }}
        >
          {initial ? "EDITAR CLASE" : "CREAR CLASE"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Nombre */}
          <div>
            <label style={labelStyle}>Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ej: Crossfit"
            />
          </div>

          {/* Instructor */}
          <div>
            <label style={labelStyle}>Instructor</label>
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Nombre del instructor"
            />
          </div>

          {/* Salón */}
          <div>
            <label style={labelStyle}>Salón</label>
            <select
              name="room_id"
              value={form.room_id}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="1">Cycling</option>
              <option value="2">Cardio Step</option>
              <option value="3">Multiclase</option>
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label style={labelStyle}>Fecha</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Hora inicio y fin */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hora inicio</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hora fin</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "#ff4444",
                fontSize: 13,
                fontFamily: "'Rajdhani', sans-serif",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          {/* Botones */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
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
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              CANCELAR
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#00e5ff",
                border: "none",
                color: "#040d0d",
                borderRadius: 6,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 12,
                letterSpacing: 1,
                fontWeight: 700,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
