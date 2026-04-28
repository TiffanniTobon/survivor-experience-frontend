import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// GET /catalogs/class-types → lista de tipos de clase para el dropdown
export async function getClassTypesRequest() {
  const response = await axios.get(`${API_URL}/catalogs/class-types`, {
    headers: getAuthHeader(),
  });
  return response.data; // { message, data: [...] }
}

// GET /catalogs/instructors → lista de instructores para el dropdown
export async function getInstructorsRequest() {
  const response = await axios.get(`${API_URL}/catalogs/instructors`, {
    headers: getAuthHeader(),
  });
  return response.data; // { message, data: [...] }
}
