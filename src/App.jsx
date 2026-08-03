import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { RutaPrivada, RutaAdmin } from "./components/RutasProtegidas";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";

function RaizPublica() {
  const { usuario } = useAuth();
  return <Navigate to={usuario ? "/productos" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RaizPublica />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RutaPrivada />}>
              <Route element={<Layout />}>
                <Route path="/productos" element={<Productos />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route element={<RutaAdmin />}>
                  <Route path="/usuarios" element={<Usuarios />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
