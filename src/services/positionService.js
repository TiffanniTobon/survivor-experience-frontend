import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// GET /positions/:roomId?classId=xxx
// Trae las posiciones de un salón con su estado (free/occupied)
// roomId  → 1=Cycling, 2=Cardio Step
// classId → id de la clase para saber qué posiciones están reservadas
export async function getPositionsRequest(roomId, classId) {
  const response = await axios.get(`${API_URL}/positions/${roomId}`, {
    headers: getAuthHeader(),
    params: { classId },
  });
  return response.data; // { message, data: [...posiciones] }
}
