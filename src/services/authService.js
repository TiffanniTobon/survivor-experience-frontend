import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(id_number, password) {
  // POST /api/auth/login → { message, token, user }
  const response = await axios.post(`${API_URL}/auth/login`, {
    id_number,
    password,
  });
  return response.data; // { token, user }
}