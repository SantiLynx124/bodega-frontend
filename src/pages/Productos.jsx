import { useEffect, useState, useCallback } from "react";
import { Plus, Search, X, PackageSearch } from "lucide-react";
import TopBar from "../components/TopBar";
import ProductoCard from "../components/ProductoCard";
import ProductoForm from "../components/ProductoForm";
import AjusteStock from "../components/AjusteStock";
import BottomSheet from "../components/BottomSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { Boton, Input } from "../components/Field";
import { productosApi } from "../api/productos";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";

export default function Productos() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sheetCrear, setSheetCrear] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [buscarIdAbierto, setBuscarIdAbierto] = useState(false);
  const [idBuscado, setIdBuscado] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await productosApi.listar();
      setProductos(data);
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

  async function guardarProducto(datos) {
    setGuardando(true);
    try {
      if (productoActivo?.id) {
        await productosApi.actualizar(productoActivo.id, datos);
        toast.exito("Producto actualizado");
      } else {
        await productosApi.registrar(datos);
        toast.exito("Producto registrado");
      }
      setSheetCrear(false);
      setProductoActivo(null);
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
      setProductoActivo(null);
      cargar();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  async function buscarPorId() {
    if (!idBuscado.trim()) return;
    try {
      const p = await productosApi.buscarId(idBuscado.trim());
      setBuscarIdAbierto(false);
      setIdBuscado("");
      setProductoActivo(p);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar
        titulo="Productos"
        subtitulo={`${productos.length} ${productos.length === 1 ? "producto activo" : "productos activos"}`}
        accion={
          <button
            onClick={() => setBuscarIdAbierto(true)}
            className="text-paper/80 hover:text-paper p-1"
            aria-label="Buscar producto desactivado por ID"
            title="Buscar por ID (incluye desactivados)"
          >
            <PackageSearch size={20} />
          </button>
        }
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
      </div>

      <div className="px-4 mt-4 flex flex-col gap-2.5">
        {cargando ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-[74px] rounded-tag bg-paper-dark animate-pulse" />
          ))
        ) : productos.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display font-semibold text-ink mb-1">Nada por aquí</p>
            <p className="text-sm text-ink-soft font-body">
              {busqueda ? "No hay productos que coincidan con tu búsqueda." : "Registra tu primer producto con el botón +."}
            </p>
          </div>
        ) : (
          productos.map((p, i) => (
            <ProductoCard key={p.id} producto={p} index={i} onAbrir={setProductoActivo} />
          ))
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
        onClose={() => setProductoActivo(null)}
        titulo={productoActivo?.nombre || "Producto"}
      >
        {productoActivo && (
          <div className="flex flex-col gap-4">
            <AjusteStock
              unidadMetrica={productoActivo.unidadMetrica}
              onAjustar={ajustarStock}
            />
            <ProductoForm
              inicial={productoActivo}
              onGuardar={guardarProducto}
              onCancelar={() => setProductoActivo(null)}
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
        )}
      </BottomSheet>

      {/* Buscar por ID (incluye desactivados) */}
      <BottomSheet abierto={buscarIdAbierto} onClose={() => setBuscarIdAbierto(false)} titulo="Buscar por ID">
        <p className="text-sm text-ink-soft font-body mb-3">
          El listado y la búsqueda solo muestran productos activos. Usa esto para encontrar un producto
          desactivado y reactivarlo.
        </p>
        <div className="flex gap-2">
          <Input
            value={idBuscado}
            onChange={(e) => setIdBuscado(e.target.value)}
            placeholder="ID del producto"
            inputMode="numeric"
          />
          <Boton onClick={buscarPorId}>Buscar</Boton>
        </div>
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
