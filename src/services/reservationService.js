import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// POST /reservations → crea una reserva
export async function createReservationRequest(classId, positionId) {
  const response = await axios.post(
    `${API_URL}/reservations`,
    { class_id: classId, position_id: positionId },
    { headers: getAuthHeader() },
  );
  return response.data;
}

// DELETE /reservations/:id → cancela una reserva
export async function cancelReservationRequest(reservationId) {
  const response = await axios.delete(
    `${API_URL}/reservations/${reservationId}`,
    { headers: getAuthHeader() },
  );
  return response.data;
}

// GET /reservations/my → reservas activas del usuario
export async function getMyReservationsRequest() {
  const response = await axios.get(`${API_URL}/reservations/my`, {
    headers: getAuthHeader(),
  });
  return response.data;
}
