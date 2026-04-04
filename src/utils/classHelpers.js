// ─── CONSTANTES ───────────────────────────────────────────────────────────────

// Mapeo de room_id a nombre del salón
export const ROOMS = { 1: "Cycling", 2: "Cardio Step", 3: "Multiclase" };

// Nombres cortos de los días para el selector
export const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Colores del badge según estado de la clase
export const STATUS_COLORS = {
  Programada: { bg: "#0a2540", text: "#00e5ff", border: "#00e5ff" },
  "En curso": { bg: "#0a2e1a", text: "#00ff88", border: "#00ff88" },
  Finalizada: { bg: "#1a1a1a", text: "#666", border: "#333" },
};

// ─── FUNCIONES DE FECHA ───────────────────────────────────────────────────────

// Devuelve el lunes de la semana actual + offset de semanas
// weekOffset=0 → esta semana, -1 → semana pasada, 1 → próxima semana
export const getMondayOfWeek = (weekOffset = 0) => {
  const today = new Date();
  const day = today.getDay(); // 0=dom, 1=lun ... 6=sáb
  const diff = day === 0 ? -6 : 1 - day; // ajuste para que lunes sea día 0
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Devuelve un array con los 7 días de la semana dado el lunes
export const getWeekDays = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

// Formatea una fecha como YYYY-MM-DD para enviar al backend
export const toISODate = (date) => date.toISOString().split("T")[0];

// Formatea el rango de la semana: "31 Mar – 6 Abr 2026"
export const formatWeekRange = (monday) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
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
  const start = `${monday.getDate()} ${months[monday.getMonth()]}`;
  const end = `${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
  return `${start} – ${end}`;
};

// ─── ESTADO DE LA CLASE ───────────────────────────────────────────────────────

// Calcula el estado de una clase comparando la hora actual con start_time y end_time
// Retorna: "Programada" | "En curso" | "Finalizada"
export const getStatus = (date, start_time, end_time) => {
  const now = new Date();
  const start = new Date(`${date}T${start_time}`);
  const end = new Date(`${date}T${end_time}`);
  if (now < start) return "Programada";
  if (now >= start && now <= end) return "En curso";
  return "Finalizada";
};
