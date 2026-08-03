import { useEffect, useState, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import TopBar from "../components/TopBar";
import UsuarioCard from "../components/UsuarioCard";
import UsuarioForm from "../components/UsuarioForm";
import BottomSheet from "../components/BottomSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { Campo, Input, Select, Boton } from "../components/Field";
import { usuariosApi } from "../api/usuarios";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function Usuarios() {
  const toast = useToast();
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sheetCrear, setSheetCrear] = useState(false);
  const [activo, setActivo] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [rolEdit, setRolEdit] = useState("VENDEDOR");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setUsuarios(await usuariosApi.listar());
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (activo) {
      setNombreEdit(activo.nombre);
      setRolEdit(activo.rol);
      setNuevoUsuario(activo.usuario);
      setNuevaPassword("");
    }
  }, [activo]);

  const filtrados = busqueda.trim()
    ? usuarios.filter(
        (u) =>
          u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.usuario.toLowerCase().includes(busqueda.toLowerCase())
      )
    : usuarios;

  async function crearUsuario(datos) {
    setGuardando(true);
    try {
      await usuariosApi.registrar(datos);
      toast.exito("Usuario creado");
      setSheetCrear(false);
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarDatosBasicos() {
    setGuardando(true);
    try {
      await usuariosApi.actualizar(activo.id, {
        nombre: nombreEdit,
        rol: rolEdit,
        usuario: activo.usuario,
        password: "sinuso1234",
      });
      toast.exito("Datos actualizados");
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarNuevoUsuario() {
    if (nuevoUsuario === activo.usuario) return;
    setGuardando(true);
    try {
      await usuariosApi.cambiarUsuario(activo.id, nuevoUsuario.trim());
      toast.exito("Usuario de acceso actualizado");
      cargar();
      setActivo(null);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarNuevaPassword() {
    if (!nuevaPassword.trim()) return;
    setGuardando(true);
    try {
      await usuariosApi.cambiarPassword(activo.id, nuevaPassword.trim());
      toast.exito("Contraseña actualizada");
      setNuevaPassword("");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado() {
    const u = confirmacion.usuario;
    try {
      if (u.estado) {
        await usuariosApi.desactivar(u.id);
        toast.exito(`${u.nombre} desactivado`);
      } else {
        await usuariosApi.activar(u.id);
        toast.exito(`${u.nombre} activado`);
      }
      setConfirmacion(null);
      setActivo(null);
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar titulo="Usuarios" subtitulo={`${usuarios.length} activos`} />

      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-2.5">
        {cargando ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-[62px] rounded-tag bg-paper-dark animate-pulse" />
          ))
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-semibold text-ink mb-1">Sin resultados</p>
            <p className="text-sm text-ink-soft font-body">No hay usuarios que coincidan.</p>
          </div>
        ) : (
          filtrados.map((u, i) => <UsuarioCard key={u.id} usuario={u} index={i} onAbrir={setActivo} />)
        )}
      </div>

      <button
        onClick={() => setSheetCrear(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-tag-mustard text-ink shadow-sheet flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Registrar nuevo usuario"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>

      <BottomSheet abierto={sheetCrear} onClose={() => setSheetCrear(false)} titulo="Nuevo usuario">
        <UsuarioForm onGuardar={crearUsuario} onCancelar={() => setSheetCrear(false)} guardando={guardando} />
      </BottomSheet>

      <BottomSheet abierto={!!activo} onClose={() => setActivo(null)} titulo={activo?.nombre || "Usuario"}>
        {activo && (
          <div className="flex flex-col gap-5">
            <div>
              <Campo label="Nombre completo">
                <Input value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} maxLength={100} />
              </Campo>
              <Campo label="Rol">
                <Select value={rolEdit} onChange={(e) => setRolEdit(e.target.value)}>
                  <option value="VENDEDOR">Vendedor</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </Select>
              </Campo>
              <Boton onClick={guardarDatosBasicos} disabled={guardando} className="w-full">
                Guardar nombre y rol
              </Boton>
            </div>

            <div className="border-t border-stone pt-4">
              <Campo label="Usuario de acceso">
                <Input value={nuevoUsuario} onChange={(e) => setNuevoUsuario(e.target.value)} maxLength={20} />
              </Campo>
              <Boton
                variante="secundario"
                onClick={guardarNuevoUsuario}
                disabled={guardando || nuevoUsuario === activo.usuario}
                className="w-full"
              >
                Actualizar usuario de acceso
              </Boton>
            </div>

            <div className="border-t border-stone pt-4">
              <Campo label="Nueva contraseña">
                <Input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                />
              </Campo>
              <Boton
                variante="secundario"
                onClick={guardarNuevaPassword}
                disabled={guardando || !nuevaPassword.trim()}
                className="w-full"
              >
                Restablecer contraseña
              </Boton>
            </div>

            {activo.id !== yo?.id && (
              <Boton
                variante={activo.estado ? "peligro" : "primario"}
                onClick={() => setConfirmacion({ usuario: activo })}
                className="w-full"
              >
                {activo.estado ? "Desactivar usuario" : "Activar usuario"}
              </Boton>
            )}
          </div>
        )}
      </BottomSheet>

      <ConfirmDialog
        abierto={!!confirmacion}
        titulo={confirmacion?.usuario.estado ? "¿Desactivar usuario?" : "¿Activar usuario?"}
        mensaje={
          confirmacion?.usuario.estado
            ? `${confirmacion.usuario.nombre} ya no podrá iniciar sesión.`
            : `${confirmacion?.usuario.nombre} podrá iniciar sesión nuevamente.`
        }
        variante={confirmacion?.usuario.estado ? "peligro" : "primario"}
        textoConfirmar={confirmacion?.usuario.estado ? "Desactivar" : "Activar"}
        onConfirmar={alternarEstado}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
