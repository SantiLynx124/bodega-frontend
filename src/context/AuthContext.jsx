import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken, clearToken, registerUnauthorizedHandler } from "../api/client";
import { decodeJwt, tokenExpirado } from "../utils/jwt";

const AuthContext = createContext(null);

function construirUsuario(token) {
  const claims = decodeJwt(token);
  if (!claims || tokenExpirado(claims)) return null;
  return {
    id: claims.id,
    usuario: claims.sub,
    rol: claims.rol,
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = getToken();
    return token ? construirUsuario(token) : null;
  });
  const [cargando, setCargando] = useState(false);

  const logout = useCallback(() => {
    clearToken();
    setUsuario(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(logout);
  }, [logout]);

  async function login(usuarioLogin, password) {
    setCargando(true);
    try {
      const res = await api.post("/auth/login", { usuario: usuarioLogin, password });
      const token = res.data; // el backend responde el token JWT como texto plano
      setToken(token);
      const datos = construirUsuario(token);
      setUsuario(datos);
      return datos;
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, esAdmin: usuario?.rol === "ADMINISTRADOR" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
