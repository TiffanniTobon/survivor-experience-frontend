import { toISODate } from "@/utils/classHelpers";

const getInputStyle = (fieldErrors, field) => ({
  background: "#0a1a1a",
  border: fieldErrors[field] ? "1px solid #ff4444" : "1px solid #1a3a3a",
  color: "#e0f7fa",
  borderRadius: 6,
  padding: "8px 12px",
  width: "100%",
  outline: "none",
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 15,
  boxSizing: "border-box",
  colorScheme: "dark",
});

const labelStyle = {
  color: "#00e5ff",
  fontSize: 11,
  letterSpacing: 2,
  textTransform: "uppercase",
  fontFamily: "'Orbitron', sans-serif",
  marginBottom: 4,
  display: "block",
};

// Genera horas disponibles según el horario del gym
const getAvailableHours = (date) => {
  if (!date) return [];
  const day = new Date(date + "T00:00:00").getDay();
  const isWeekend = day === 0 || day === 6;
  const start = isWeekend ? 8 : 5;
  const end = isWeekend ? 14 : 21;
  const hours = [];
  for (let h = start; h <= end; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
  }
  return hours;
};

// Recibe:
// form         → objeto con los valores del formulario
// fieldErrors  → objeto con los campos que tienen error { name: true, ... }
// classTypes   → array de tipos de clase para el dropdown
// instructors  → array de instructores para el dropdown
// onChange     → handler para actualizar el form
export default function ClassForm({
  form,
  fieldErrors,
  classTypes,
  instructors,
  onChange,
}) {
  const isToday = form.date === toISODate(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Nombre de la clase */}
      <div>
        <label style={labelStyle}>Nombre de la clase</label>
        <select
          name="name"
          value={form.name}
          onChange={onChange}
          style={getInputStyle(fieldErrors, "name")}
        >
          <option value="">Selecciona una clase</option>
          {classTypes.map((ct) => (
            <option key={ct.id} value={ct.name}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>

      {/* Instructor */}
      <div>
        <label style={labelStyle}>Instructor</label>
        <select
          name="instructor"
          value={form.instructor}
          onChange={onChange}
          style={getInputStyle(fieldErrors, "instructor")}
        >
          <option value="">Selecciona un instructor</option>
          {instructors.map((ins) => (
            <option key={ins.id} value={ins.name}>
              {ins.name}
            </option>
          ))}
        </select>
      </div>

      {/* Salón */}
      <div>
        <label style={labelStyle}>Salón</label>
        <select
          name="room_id"
          value={form.room_id}
          onChange={onChange}
          style={getInputStyle(fieldErrors, "room_id")}
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
          onChange={onChange}
          min={toISODate(new Date())}
          style={getInputStyle(fieldErrors, "date")}
        />
      </div>

      {/* Hora inicio y fin */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Hora inicio</label>
          <select
            name="start_time"
            value={form.start_time}
            onChange={onChange}
            style={getInputStyle(fieldErrors, "start_time")}
          >
            <option value="">Selecciona</option>
            {getAvailableHours(form.date).map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Hora fin</label>
          <select
            name="end_time"
            value={form.end_time}
            onChange={onChange}
            style={getInputStyle(fieldErrors, "end_time")}
          >
            <option value="">Selecciona</option>
            {getAvailableHours(form.date)
              .filter((h) => !form.start_time || h > form.start_time)
              .map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
