import axios from "axios";

// La URL del backend se define por variable de entorno.
// En local (XAMPP + Spring Boot corriendo en tu PC): http://localhost:8080
// Cuando migres a Oracle Cloud, solo cambia VITE_API_URL en Vercel
// (Project Settings -> Environment Variables) y vuelve a desplegar.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "bodega_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extrae un mensaje de error legible de la respuesta del backend.
// El GlobalExceptionHandler de Spring a veces responde con texto plano
// y a veces con un mapa { campo: mensaje } para errores de validación.
export function extraerMensajeError(error) {
  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido y accesible.";
  }
  const { data, status } = error.response;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const valores = Object.values(data);
    if (valores.length) return valores.join(" · ");
  }
  if (status === 401) return "Sesión inválida o expirada. Vuelve a iniciar sesión.";
  if (status === 403) return "No tienes permiso para realizar esta acción.";
  return "Ocurrió un error inesperado.";
}

let onUnauthorized = null;
export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);
