import { useState, useEffect } from "react";
import {
  getClassTypesRequest,
  getInstructorsRequest,
} from "@/services/catalogService";
import { toISODate } from "@/utils/classHelpers";
import ClassForm from "@/components/admin/ClassForm";

const EMPTY_FORM = {
  class_type_id: "",
  instructor_id: "",
  room_id: "1",
  date: "",
  start_time: "",
  end_time: "",
};

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  initial,
  defaultDate,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [classTypes, setClassTypes] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ...EMPTY_FORM,
      date: defaultDate || "",
      ...(initial || {}),
    });
    setError("");
    setFieldErrors({});

    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      try {
        const [typesRes, instructorsRes] = await Promise.all([
          getClassTypesRequest(),
          getInstructorsRequest(),
        ]);
        setClassTypes(typesRes.data || []);
        setInstructors(instructorsRes.data || []);
      } catch {
        setError("Error al cargar los catálogos.");
      } finally {
        setLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
  }, [isOpen, initial]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Limpia el error del campo cuando el usuario lo corrige
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const handleSubmit = async () => {
    // Validación de campos obligatorios
    const errors = {};
    if (!form.class_type_id) errors.class_type_id = true;
    if (!form.instructor_id) errors.instructor_id = true;
    if (!form.date) errors.date = true;
    if (!form.start_time) errors.start_time = true;
    if (!form.end_time) errors.end_time = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Hora fin debe ser mayor a hora inicio
    if (form.end_time <= form.start_time) {
      setFieldErrors({ end_time: true });
      setError("La hora de fin debe ser mayor a la hora de inicio.");
      return;
    }

    // Hora inicio debe ser al menos 1 hora desde ahora
    const now = new Date();
    const startDateTime = new Date(`${form.date}T${form.start_time}`);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (startDateTime < oneHourFromNow) {
      setFieldErrors({ start_time: true });
      setError(
        "La hora de inicio debe ser al menos 1 hora mayor a la hora actual.",
      );
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Room is already occupied at that time") {
        setError("El salón ya tiene una clase programada en ese horario.");
      } else {
        setError("Error al guardar la clase. Intenta de nuevo.");
      }
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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

        {loadingCatalogs ? (
          <p
            style={{
              color: "#336666",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: 2,
            }}
          >
            Cargando opciones...
          </p>
        ) : (
          <>
            <ClassForm
              form={form}
              fieldErrors={fieldErrors}
              classTypes={classTypes}
              instructors={instructors}
              onChange={handleChange}
            />

            {error && (
              <p
                style={{
                  color: "#ff4444",
                  fontSize: 13,
                  fontFamily: "'Rajdhani', sans-serif",
                  margin: "16px 0 0",
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
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
          </>
        )}
      </div>
    </div>
  );
}
