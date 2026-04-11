import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBottomBar from "@/components/admin/AdminBottomBar";
import WeekNavigator from "@/components/admin/WeekNavigator";
import ClassesTable from "@/components/admin/ClassesTable";
import ClassModal from "@/components/admin/ClassModal";
import useIsMobile from "@/hooks/useIsMobile";
import { getMondayOfWeek, getWeekDays, toISODate } from "@/utils/classHelpers";
import {
  getClassesRequest,
  createClassRequest,
  updateClassRequest,
  deleteClassRequest,
} from "@/services/classService";
import Toast from "@/components/ui/Toast";

export default function AdminPage() {
  const isMobile = useIsMobile();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [toast, setToast] = useState(null);

  const monday = getMondayOfWeek(weekOffset);
  const weekDays = getWeekDays(monday);
  const selectedDate = weekDays[selectedDayIndex];
  const isSelectedDayPast = toISODate(selectedDate) < toISODate(new Date());

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

  // helper para mostrar el toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ─── FILTRO POR DÍA ───────────────────────────────────────────────────
  const classesForDay = classes.filter(
    (c) => c.date === toISODate(selectedDate),
  );

  // ─── HANDLERS ─────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingClass(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass({
      ...cls,
      room_id: String(cls.room_id),
      start_time: cls.start_time.slice(0, 5),
      end_time: cls.end_time.slice(0, 5),
    });
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    if (editingClass) {
      await updateClassRequest(editingClass.id, form);
      showToast("Clase actualizada correctamente"); // 👈 AGREGAR
    } else {
      await createClassRequest(form);
      showToast("Clase creada correctamente"); // 👈 AGREGAR
    }
    await fetchClasses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    await deleteClassRequest(id);
    await fetchClasses();
    showToast("Clase eliminada", "error"); // 👈 AGREGAR
  };
  // ─── RENDER ───────────────────────────────────────────────────────────
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#040d0d",
        }}
      >
        {/* Sidebar — solo desktop */}

        <AdminSidebar
          onCreateClass={handleOpenCreate}
          disableCreate={isSelectedDayPast}
        />

        <main
          style={{
            flex: 1,
            padding: isMobile ? "24px 16px" : "40px 48px",
            overflowY: "auto",
          }}
        >
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
                ADMIN DASHBOARD
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
              Panel de control de actividades grupales
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

          <ClassesTable
            classes={classesForDay}
            loading={loading}
            error={error}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* Barra inferior — solo móvil */}
      {isMobile && (
        <AdminBottomBar
          activeTab="clases"
          onCreateClass={handleOpenCreate}
          disableCreate={isSelectedDayPast}
        />
      )}

      <ClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingClass}
      />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  );
}
