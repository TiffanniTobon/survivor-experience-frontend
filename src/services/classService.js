import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Obtenemos el token del localStorage para enviarlo en cada petición
// El backend lo necesita para verificar que el usuario está autenticado
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// GET /classes → trae todas las clases
// GET /classes?date=YYYY-MM-DD → filtra por semana
export async function getClassesRequest(date) {
  const params = date ? { date } : {};
  const response = await axios.get(`${API_URL}/classes`, {
    headers: getAuthHeader(),
    params,
  });
  return response.data; // { message, data: [...clases] }
}

// POST /classes → crea una clase nueva (solo admin)
export async function createClassRequest(classData) {
  const response = await axios.post(`${API_URL}/classes`, classData, {
    headers: getAuthHeader(),
  });
  return response.data;
}

// PUT /classes/:id → edita una clase existente (solo admin)
export async function updateClassRequest(id, classData) {
  const response = await axios.put(`${API_URL}/classes/${id}`, classData, {
    headers: getAuthHeader(),
  });
  return response.data;
}

// DELETE /classes/:id → elimina una clase (solo admin)
export async function deleteClassRequest(id) {
  const response = await axios.delete(`${API_URL}/classes/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
}
