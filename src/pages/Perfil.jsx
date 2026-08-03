import { useState } from "react";
import { LogOut } from "lucide-react";
import TopBar from "../components/TopBar";
import { Campo, Input, Boton } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { usuariosApi } from "../api/usuarios";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";

const rolEtiqueta = { ADMINISTRADOR: "Administrador", VENDEDOR: "Vendedor" };

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const toast = useToast();
  const [nuevoUsuario, setNuevoUsuario] = useState(usuario?.usuario || "");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [guardandoUsuario, setGuardandoUsuario] = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  async function actualizarUsuario() {
    if (!nuevoUsuario.trim() || nuevoUsuario === usuario.usuario) return;
    setGuardandoUsuario(true);
    try {
      await usuariosApi.cambiarMiUsuario(nuevoUsuario.trim());
      toast.exito("Usuario actualizado. Vuelve a iniciar sesión.");
      logout();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardandoUsuario(false);
    }
  }

  async function actualizarPassword() {
    if (!nuevaPassword.trim()) return;
    setGuardandoPassword(true);
    try {
      await usuariosApi.cambiarMiPassword(nuevaPassword.trim());
      toast.exito("Contraseña actualizada. Vuelve a iniciar sesión.");
      logout();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardandoPassword(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar titulo="Mi perfil" subtitulo={rolEtiqueta[usuario?.rol] || usuario?.rol} />

      <div className="px-4 pt-5 flex flex-col gap-5">
        <div className="bg-paper-card rounded-tag shadow-card p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-awning/10 text-awning flex items-center justify-center font-display font-bold text-lg shrink-0">
            {usuario?.usuario?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display font-semibold text-ink">@{usuario?.usuario}</p>
            <p className="text-xs text-ink-soft font-body">{rolEtiqueta[usuario?.rol] || usuario?.rol}</p>
          </div>
        </div>

        <div className="bg-paper-card rounded-tag shadow-card p-4">
          <Campo label="Cambiar usuario de acceso">
            <Input value={nuevoUsuario} onChange={(e) => setNuevoUsuario(e.target.value)} maxLength={20} />
          </Campo>
          <Boton
            variante="secundario"
            onClick={actualizarUsuario}
            disabled={guardandoUsuario || nuevoUsuario === usuario?.usuario}
            className="w-full"
          >
            Guardar usuario
          </Boton>
        </div>

        <div className="bg-paper-card rounded-tag shadow-card p-4">
          <Campo label="Nueva contraseña">
            <Input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
            />
          </Campo>
          <Boton
            variante="secundario"
            onClick={actualizarPassword}
            disabled={guardandoPassword || !nuevaPassword.trim()}
            className="w-full"
          >
            Guardar contraseña
          </Boton>
        </div>

        <Boton variante="peligro" onClick={logout} className="w-full">
          <LogOut size={16} /> Cerrar sesión
        </Boton>
      </div>
    </div>
  );
}
