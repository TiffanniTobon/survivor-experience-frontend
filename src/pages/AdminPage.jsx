import { useState, useEffect } from "react";
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
import { useSearchParams } from "react-router-dom";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminPage() {
  const isMobile = useIsMobile();

  const [searchParams, setSearchParams] = useSearchParams();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    classId: null,
  });

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

  //Estados
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setEditingClass(null);
      setModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams]);

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

  const showToast = (message, type = "success") => setToast({ message, type });

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
      showToast("Clase actualizada correctamente");
    } else {
      await createClassRequest(form);
      showToast("Clase creada correctamente");
    }
    await fetchClasses();
  };

  const handleDelete = async () => {
    await deleteClassRequest(deleteModal.classId);
    await fetchClasses();
    showToast("Clase eliminada", "error");
  };

  // ─── RENDER ───────────────────────────────────────────────────────────
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
            El mejor gym de Buenos Aires
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
        onDelete={(id) => setDeleteModal({ isOpen: true, classId: id })}
      />

      <ClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingClass}
        defaultDate={toISODate(selectedDate)}
      />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="¿Eliminar clase?"
        message="Esta acción eliminará la clase permanentemente y no se puede deshacer."
        confirmLabel="Eliminar clase"
        confirmColor="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteModal({ isOpen: false, classId: null })}
      />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
