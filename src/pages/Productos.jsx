import { useEffect, useState, useCallback } from "react";
import { Plus, Search, X, Pencil } from "lucide-react";
import TopBar from "../components/TopBar";
import ProductoCard from "../components/ProductoCard";
import ProductoForm from "../components/ProductoForm";
import ProductoDetalle from "../components/ProductoDetalle";
import BottomSheet from "../components/BottomSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { Boton, Input } from "../components/Field";
import { productosApi } from "../api/productos";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";

export default function Productos() {
  const toast = useToast();
  const [tab, setTab] = useState("activos"); // "activos" | "desactivados"
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sheetCrear, setSheetCrear] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = tab === "activos" ? await productosApi.listar() : await productosApi.listarDesactivados();
      setProductos(data);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, tab]);

  useEffect(() => {
    setBusqueda("");
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (tab !== "activos") return; // la búsqueda por nombre del backend solo cubre activos
    const t = setTimeout(async () => {
      if (!busqueda.trim()) return cargar();
      try {
        const data = await productosApi.buscarNombre(busqueda.trim());
        setProductos(data);
      } catch (err) {
        toast.error(extraerMensajeError(err));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const visibles =
    tab === "desactivados" && busqueda.trim()
      ? productos.filter(
          (p) =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.marca.toLowerCase().includes(busqueda.toLowerCase())
        )
      : productos;

  function abrirProducto(p) {
    setProductoActivo(p);
    setModoEdicion(false);
  }

  function cerrarSheetDetalle() {
    setProductoActivo(null);
    setModoEdicion(false);
  }

  async function guardarProducto(datos) {
    setGuardando(true);
    try {
      if (productoActivo?.id) {
        const actualizado = await productosApi.actualizar(productoActivo.id, datos);
        toast.exito("Producto actualizado");
        setProductoActivo(actualizado);
        setModoEdicion(false);
      } else {
        await productosApi.registrar(datos);
        toast.exito("Producto registrado");
        setSheetCrear(false);
      }
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function ajustarStock(tipo, cantidad) {
    try {
      const actualizado =
        tipo === "aumentar"
          ? await productosApi.aumentarStock(productoActivo.id, cantidad)
          : await productosApi.disminuirStock(productoActivo.id, cantidad);
      setProductoActivo(actualizado);
      toast.exito(tipo === "aumentar" ? "Stock aumentado" : "Stock disminuido");
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  async function alternarEstado() {
    const p = confirmacion.producto;
    try {
      if (p.estado) {
        await productosApi.desactivar(p.id);
        toast.exito(`${p.nombre} desactivado`);
      } else {
        await productosApi.activar(p.id);
        toast.exito(`${p.nombre} activado`);
      }
      setConfirmacion(null);
      cerrarSheetDetalle();
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar
        titulo="Productos"
        subtitulo={`${productos.length} ${
          tab === "activos"
            ? productos.length === 1
              ? "producto activo"
              : "productos activos"
            : productos.length === 1
            ? "producto desactivado"
            : "productos desactivados"
        }`}
      />

      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o marca..."
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

        <div className="flex gap-1.5 mt-3 bg-paper-dark rounded-tag p-1">
          {[
            { id: "activos", label: "Activos" },
            { id: "desactivados", label: "Desactivados" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-tag py-1.5 text-sm font-body font-semibold transition-colors ${
                tab === t.id ? "bg-paper-card text-ink shadow-card" : "text-ink-soft"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-2.5">
        {cargando ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-[74px] rounded-tag bg-paper-dark animate-pulse" />
          ))
        ) : visibles.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-semibold text-ink mb-1">Nada por aquí</p>
            <p className="text-sm text-ink-soft font-body">
              {busqueda
                ? "No hay productos que coincidan con tu búsqueda."
                : tab === "activos"
                ? "Registra tu primer producto con el botón +."
                : "No hay productos desactivados."}
            </p>
          </div>
        ) : (
          visibles.map((p, i) => <ProductoCard key={p.id} producto={p} index={i} onAbrir={abrirProducto} />)
        )}
      </div>

      <button
        onClick={() => setSheetCrear(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-tag-mustard text-ink shadow-sheet flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Registrar nuevo producto"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>

      {/* Crear producto */}
      <BottomSheet abierto={sheetCrear} onClose={() => setSheetCrear(false)} titulo="Nuevo producto">
        <ProductoForm onGuardar={guardarProducto} onCancelar={() => setSheetCrear(false)} guardando={guardando} />
      </BottomSheet>

      {/* Detalle / editar producto */}
      <BottomSheet
        abierto={!!productoActivo}
        onClose={cerrarSheetDetalle}
        titulo={productoActivo?.nombre || "Producto"}
        etiquetaEsquina={productoActivo ? `ID ${productoActivo.id}` : null}
        accionExtra={
          productoActivo && !modoEdicion ? (
            <button
              onClick={() => setModoEdicion(true)}
              className="p-1.5 rounded-full text-ink-soft hover:bg-stone/60 transition-colors"
              aria-label="Editar producto"
              title="Editar producto"
            >
              <Pencil size={18} />
            </button>
          ) : null
        }
      >
        {productoActivo &&
          (modoEdicion ? (
            <div className="flex flex-col gap-4">
              <ProductoForm
                inicial={productoActivo}
                onGuardar={guardarProducto}
                onCancelar={() => setModoEdicion(false)}
                guardando={guardando}
              />
              <Boton
                variante={productoActivo.estado ? "peligro" : "primario"}
                onClick={() => setConfirmacion({ producto: productoActivo })}
                className="w-full"
              >
                {productoActivo.estado ? "Desactivar producto" : "Activar producto"}
              </Boton>
            </div>
          ) : (
            <ProductoDetalle producto={productoActivo} onAjustar={ajustarStock} />
          ))}
      </BottomSheet>

      <ConfirmDialog
        abierto={!!confirmacion}
        titulo={confirmacion?.producto.estado ? "¿Desactivar producto?" : "¿Activar producto?"}
        mensaje={
          confirmacion?.producto.estado
            ? `${confirmacion.producto.nombre} dejará de aparecer en el listado y búsquedas.`
            : `${confirmacion?.producto.nombre} volverá a estar disponible en el listado.`
        }
        variante={confirmacion?.producto.estado ? "peligro" : "primario"}
        textoConfirmar={confirmacion?.producto.estado ? "Desactivar" : "Activar"}
        onConfirmar={alternarEstado}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
