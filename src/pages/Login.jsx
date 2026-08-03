import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extraerMensajeError } from "../api/client";
import { Campo, Input, Boton } from "../components/Field";
import { LockKeyhole } from "lucide-react";

export default function Login() {
  const { login, cargando } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(usuario.trim(), password);
      const destino = location.state?.from || "/productos";
      navigate(destino, { replace: true });
    } catch (err) {
      setError(extraerMensajeError(err));
    }
  }

  return (
    <div className="min-h-[100dvh] bg-awning flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-sm mx-auto w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-tag bg-paper text-awning mb-4 rotate-[-4deg] shadow-card">
            <LockKeyhole size={26} strokeWidth={2} />
          </div>
          <h1 className="font-display font-bold text-2xl text-paper tracking-tight">Mi Bodega</h1>
          <p className="text-paper/70 text-sm font-body mt-1">Control de inventario y ventas</p>
        </div>

        <form onSubmit={onSubmit} className="bg-paper-card rounded-2xl p-5 shadow-card">
          <Campo label="Usuario">
            <Input
              autoFocus
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ej. admin"
              required
            />
          </Campo>
          <Campo label="Contraseña">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Campo>

          {error && (
            <p className="text-tag-red text-sm font-body mb-4 -mt-1" role="alert">
              {error}
            </p>
          )}

          <Boton type="submit" disabled={cargando} className="w-full">
            {cargando ? "Ingresando..." : "Ingresar"}
          </Boton>
        </form>

        <p className="text-paper/50 text-xs font-body text-center mt-6">
          ¿Olvidaste tu contraseña? Pide a un administrador que la restablezca.
        </p>
      </div>
    </div>
  );
}
