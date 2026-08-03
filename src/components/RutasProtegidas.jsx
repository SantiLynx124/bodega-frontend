import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RutaPrivada() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RutaAdmin() {
  const { esAdmin } = useAuth();
  if (!esAdmin) return <Navigate to="/productos" replace />;
  return <Outlet />;
}
