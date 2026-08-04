import { useEffect, useState, useCallback } from "react";
import { Plus, Search, X, Pencil, Settings } from "lucide-react";
import TopBar from "../components/TopBar";
import ClienteCard from "../components/ClienteCard";
import ClienteForm from "../components/ClienteForm";
import CuentaFiadoPanel from "../components/CuentaFiadoPanel";
import ConfiguracionFiadoForm from "../components/ConfiguracionFiadoForm";
import BottomSheet from "../components/BottomSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { Boton, Input } from "../components/Field";
import { clientesApi } from "../api/clientes";
import { configuracionFiadoApi } from "../api/configuracionFiado";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function Clientes() {
  const toast = useToast();
  const { esAdmin } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sheetCrear, setSheetCrear] = useState(false);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cuenta, setCuenta] = useState(null);
  const [cargandoCuenta, setCargandoCuenta] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [sheetConfig, setSheetConfig] = useState(false);
  const [config, setConfig] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setClientes(await clientesApi.listar());
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
    configuracionFiadoApi.obtener().then(setConfig).catch(() => {});
  }, [cargar]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!busqueda.trim()) return cargar();
      try {
        setClientes(await clientesApi.buscarNombre(busqueda.trim()));
      } catch (err) {
        toast.error(extraerMensajeError(err));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  async function abrirCliente(c) {
    setClienteActivo(c);
    setModoEdicion(false);
    setCuenta(null);
    setCargandoCuenta(true);
    try {
      setCuenta(await clientesApi.verCuentaFiado(c.id));
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargandoCuenta(false);
    }
  }

  function cerrarSheetDetalle() {
    setClienteActivo(null);
    setModoEdicion(false);
    setCuenta(null);
  }

  async function guardarCliente(datos) {
    setGuardando(true);
    try {
      if (clienteActivo?.id) {
        const actualizado = await clientesApi.actualizar(clienteActivo.id, datos);
        toast.exito("Cliente actualizado");
        setClienteActivo(actualizado);
        setModoEdicion(false);
      } else {
        await clientesApi.registrar(datos);
        toast.exito("Cliente registrado");
        setSheetCrear(false);
      }
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado() {
    const c = confirmacion.cliente;
    try {
      if (c.estado) {
        await clientesApi.desactivar(c.id);
        toast.exito(`${c.nombre} desactivado`);
      } else {
        await clientesApi.activar(c.id);
        toast.exito(`${c.nombre} activado`);
      }
      setConfirmacion(null);
      cerrarSheetDetalle();
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  async function actualizarTope(tope) {
    setGuardando(true);
    try {
      setCuenta(await clientesApi.actualizarTope(clienteActivo.id, tope));
      toast.exito("Tope actualizado");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function alternarHabilitado() {
    setGuardando(true);
    try {
      setCuenta(
        cuenta.fiadoHabilitado
          ? await clientesApi.desactivarFiado(clienteActivo.id)
          : await clientesApi.activarFiado(clienteActivo.id)
      );
      toast.exito("Cuenta fiado actualizada");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function registrarAbono(monto) {
    setGuardando(true);
    try {
      setCuenta(await clientesApi.registrarAbono(clienteActivo.id, monto));
      toast.exito("Abono registrado");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarConfig(datos) {
    setGuardando(true);
    try {
      setConfig(await configuracionFiadoApi.actualizar(datos));
      toast.exito("Configuración actualizada");
      setSheetConfig(false);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar
        titulo="Clientes"
        subtitulo={`${clientes.length} ${clientes.length === 1 ? "cliente activo" : "clientes activos"}`}
        accion={
          esAdmin && (
            <button
              onClick={() => setSheetConfig(true)}
              className="text-paper/80 hover:text-paper p-1"
              aria-label="Configuración de fiado"
              title="Configuración de fiado"
            >
              <Settings size={20} />
            </button>
          )
        }
      />

      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente por nombre..."
            className="pl-9 pr-9"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-2.5">
        {cargando ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-[62px] rounded-tag bg-paper-dark animate-pulse" />)
        ) : clientes.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-semibold text-ink mb-1">Nada por aquí</p>
            <p className="text-sm text-ink-soft font-body">
              {busqueda ? "No hay clientes que coincidan con tu búsqueda." : "Registra tu primer cliente con el botón +."}
            </p>
          </div>
        ) : (
          clientes.map((c, i) => <ClienteCard key={c.id} cliente={c} index={i} onAbrir={abrirCliente} />)
        )}
      </div>

      <button
        onClick={() => setSheetCrear(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-tag-mustard text-ink shadow-sheet flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Registrar nuevo cliente"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>

      {/* Crear cliente */}
      <BottomSheet abierto={sheetCrear} onClose={() => setSheetCrear(false)} titulo="Nuevo cliente">
        <ClienteForm onGuardar={guardarCliente} onCancelar={() => setSheetCrear(false)} guardando={guardando} />
      </BottomSheet>

      {/* Detalle / editar cliente */}
      <BottomSheet
        abierto={!!clienteActivo}
        onClose={cerrarSheetDetalle}
        titulo={clienteActivo?.nombre || "Cliente"}
        etiquetaEsquina={clienteActivo ? `ID ${clienteActivo.id}` : null}
        accionExtra={
          clienteActivo && !modoEdicion ? (
            <button
              onClick={() => setModoEdicion(true)}
              className="p-1.5 rounded-full text-ink-soft hover:bg-stone/60 transition-colors"
              aria-label="Editar cliente"
              title="Editar cliente"
            >
              <Pencil size={18} />
            </button>
          ) : null
        }
      >
        {clienteActivo &&
          (modoEdicion ? (
            <div className="flex flex-col gap-4">
              <ClienteForm
                inicial={clienteActivo}
                onGuardar={guardarCliente}
                onCancelar={() => setModoEdicion(false)}
                guardando={guardando}
              />
              <Boton
                variante={clienteActivo.estado ? "peligro" : "primario"}
                onClick={() => setConfirmacion({ cliente: clienteActivo })}
                className="w-full"
              >
                {clienteActivo.estado ? "Desactivar cliente" : "Activar cliente"}
              </Boton>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-body font-semibold uppercase tracking-wide text-paper px-2 py-1 rounded-tag ${
                    clienteActivo.estado ? "bg-awning" : "bg-ink-soft"
                  }`}
                >
                  {clienteActivo.estado ? "Activo" : "Desactivado"}
                </span>
                {clienteActivo.telefono && (
                  <span className="text-xs text-ink-soft font-body">{clienteActivo.telefono}</span>
                )}
              </div>
              {clienteActivo.descripcion && (
                <p className="text-sm text-ink-soft font-body">{clienteActivo.descripcion}</p>
              )}

              <div className="border-t border-stone pt-4">
                <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-3">
                  Cuenta fiado
                </p>
                {cargandoCuenta || !cuenta ? (
                  <div className="h-24 rounded-tag bg-paper-dark animate-pulse" />
                ) : (
                  <CuentaFiadoPanel
                    cuenta={cuenta}
                    configGlobal={config}
                    onActualizarTope={actualizarTope}
                    onToggleHabilitado={alternarHabilitado}
                    onAbono={registrarAbono}
                    procesando={guardando}
                  />
                )}
              </div>
            </div>
          ))}
      </BottomSheet>

      {/* Configuración global de fiado (admin) */}
      {esAdmin && (
        <BottomSheet abierto={sheetConfig} onClose={() => setSheetConfig(false)} titulo="Configuración de fiado">
          {config && <ConfiguracionFiadoForm config={config} onGuardar={guardarConfig} guardando={guardando} />}
        </BottomSheet>
      )}

      <ConfirmDialog
        abierto={!!confirmacion}
        titulo={confirmacion?.cliente.estado ? "¿Desactivar cliente?" : "¿Activar cliente?"}
        mensaje={
          confirmacion?.cliente.estado
            ? `${confirmacion.cliente.nombre} dejará de aparecer en el listado y búsquedas.`
            : `${confirmacion?.cliente.nombre} volverá a estar disponible en el listado.`
        }
        variante={confirmacion?.cliente.estado ? "peligro" : "primario"}
        textoConfirmar={confirmacion?.cliente.estado ? "Desactivar" : "Activar"}
        onConfirmar={alternarEstado}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
