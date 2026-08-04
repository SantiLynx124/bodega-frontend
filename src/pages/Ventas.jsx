import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, X, Users, ShoppingCart } from "lucide-react";
import TopBar from "../components/TopBar";
import CarritoItem from "../components/CarritoItem";
import VentaCard from "../components/VentaCard";
import BottomSheet from "../components/BottomSheet";
import ConfirmDialog from "../components/ConfirmDialog";
import { Boton, Input } from "../components/Field";
import { productosApi } from "../api/productos";
import { clientesApi } from "../api/clientes";
import { ventasApi } from "../api/ventas";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";

const METODOS = [
  { id: "CONTADO", label: "Contado" },
  { id: "YAPE", label: "Yape" },
  { id: "FIADO", label: "Fiado" },
];

export default function Ventas() {
  const toast = useToast();

  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [resultadosProducto, setResultadosProducto] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("CONTADO");

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [resultadosCliente, setResultadosCliente] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [registrando, setRegistrando] = useState(false);

  const [ventas, setVentas] = useState([]);
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [ventaActiva, setVentaActiva] = useState(null);
  const [confirmacionAnular, setConfirmacionAnular] = useState(null);

  const cargarVentas = useCallback(async () => {
    setCargandoVentas(true);
    try {
      const data = await ventasApi.listar();
      data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setVentas(data);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargandoVentas(false);
    }
  }, [toast]);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  // Búsqueda de productos para agregar al carrito
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!busquedaProducto.trim()) return setResultadosProducto([]);
      try {
        const data = await productosApi.buscarNombre(busquedaProducto.trim());
        setResultadosProducto(data.slice(0, 6));
      } catch {
        setResultadosProducto([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [busquedaProducto]);

  // Búsqueda de clientes (solo relevante para fiado)
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!busquedaCliente.trim()) return setResultadosCliente([]);
      try {
        setResultadosCliente(await clientesApi.buscarNombre(busquedaCliente.trim()));
      } catch {
        setResultadosCliente([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [busquedaCliente]);

  function agregarProducto(p) {
    setCarrito((c) => {
      const existe = c.find((it) => it.productoId === p.id);
      if (existe) {
        const paso = p.unidadMetrica === "KILOGRAMO" ? 0.1 : 1;
        return c.map((it) =>
          it.productoId === p.id ? { ...it, cantidad: Math.round((it.cantidad + paso) * 100) / 100 } : it
        );
      }
      return [
        ...c,
        {
          productoId: p.id,
          nombre: p.nombre,
          precioVenta: Number(p.precioVenta),
          unidadMetrica: p.unidadMetrica,
          cantidad: p.unidadMetrica === "KILOGRAMO" ? 0.1 : 1,
        },
      ];
    });
    setBusquedaProducto("");
    setResultadosProducto([]);
  }

  function cambiarCantidad(productoId, cantidad) {
    setCarrito((c) => c.map((it) => (it.productoId === productoId ? { ...it, cantidad } : it)));
  }

  function quitarDelCarrito(productoId) {
    setCarrito((c) => c.filter((it) => it.productoId !== productoId));
  }

  function seleccionarCliente(c) {
    setClienteSeleccionado(c);
    setBusquedaCliente("");
    setResultadosCliente([]);
  }

  const total = carrito.reduce((acc, it) => acc + it.precioVenta * it.cantidad, 0);
  const puedeRegistrar = carrito.length > 0 && (metodoPago !== "FIADO" || !!clienteSeleccionado);

  async function registrarVenta() {
    setRegistrando(true);
    try {
      const respuesta = await ventasApi.registrar({
        clienteId: metodoPago === "FIADO" ? clienteSeleccionado.id : null,
        metodoPago,
        items: carrito.map((it) => ({ productoId: it.productoId, cantidad: it.cantidad })),
      });
      toast.exito("Venta registrada");
      if (respuesta.excedeLimiteFiado) {
        toast.error(respuesta.mensajeAdvertencia || "El cliente superó su límite de fiado");
      }
      setCarrito([]);
      setMetodoPago("CONTADO");
      setClienteSeleccionado(null);
      cargarVentas();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setRegistrando(false);
    }
  }

  async function anularVenta() {
    try {
      await ventasApi.anular(confirmacionAnular.id);
      toast.exito("Venta anulada");
      setConfirmacionAnular(null);
      setVentaActiva(null);
      cargarVentas();
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  }

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar
        titulo="Ventas"
        subtitulo={`${ventas.length} ${ventas.length === 1 ? "venta registrada" : "ventas registradas"}`}
        accion={
          <Link to="/clientes" className="text-paper/80 hover:text-paper p-1" aria-label="Ver clientes" title="Clientes">
            <Users size={20} />
          </Link>
        }
      />

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Buscador de productos */}
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
          <Input
            value={busquedaProducto}
            onChange={(e) => setBusquedaProducto(e.target.value)}
            placeholder="Agregar producto a la venta..."
            className="pl-9 pr-9"
          />
          {busquedaProducto && (
            <button
              onClick={() => setBusquedaProducto("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft/50"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
          {resultadosProducto.length > 0 && (
            <div className="absolute z-20 mt-1.5 w-full bg-paper-card rounded-tag shadow-sheet border border-stone overflow-hidden">
              {resultadosProducto.map((p) => (
                <button
                  key={p.id}
                  onClick={() => agregarProducto(p)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-paper active:bg-paper-dark transition-colors border-b border-stone last:border-b-0"
                >
                  <span className="min-w-0">
                    <p className="font-body text-sm font-semibold text-ink truncate">{p.nombre}</p>
                    <p className="text-xs text-ink-soft font-body truncate">{p.marca}</p>
                  </span>
                  <span className="font-mono text-sm text-awning shrink-0">S/ {Number(p.precioVenta).toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Carrito */}
        {carrito.length > 0 && (
          <div className="flex flex-col gap-2">
            {carrito.map((it) => (
              <CarritoItem
                key={it.productoId}
                item={it}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
              />
            ))}
          </div>
        )}

        {/* Método de pago */}
        <div>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-1.5">Método de pago</p>
          <div className="flex gap-1.5 bg-paper-dark rounded-tag p-1">
            {METODOS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetodoPago(m.id)}
                className={`flex-1 rounded-tag py-1.5 text-sm font-body font-semibold transition-colors ${
                  metodoPago === m.id ? "bg-paper-card text-ink shadow-card" : "text-ink-soft"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selección de cliente para fiado */}
        {metodoPago === "FIADO" && (
          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-1.5">Cliente</p>
            {clienteSeleccionado ? (
              <div className="flex items-center justify-between bg-paper-card rounded-tag shadow-card px-3.5 py-2.5">
                <span className="font-body text-sm font-semibold text-ink">{clienteSeleccionado.nombre}</span>
                <button
                  onClick={() => setClienteSeleccionado(null)}
                  className="text-ink-soft"
                  aria-label="Quitar cliente seleccionado"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Buscar cliente por nombre..."
                />
                {resultadosCliente.length > 0 && (
                  <div className="absolute z-20 mt-1.5 w-full bg-paper-card rounded-tag shadow-sheet border border-stone overflow-hidden">
                    {resultadosCliente.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => seleccionarCliente(c)}
                        className="w-full px-3.5 py-2.5 text-left font-body text-sm text-ink hover:bg-paper active:bg-paper-dark transition-colors border-b border-stone last:border-b-0"
                      >
                        {c.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Total y confirmar */}
        <div className="bg-paper-card rounded-tag shadow-card px-4 py-3.5 flex items-center justify-between">
          <span className="font-body font-semibold text-ink-soft text-sm">Total</span>
          <span className="font-mono font-bold text-xl text-ink">S/ {total.toFixed(2)}</span>
        </div>

        <Boton onClick={registrarVenta} disabled={!puedeRegistrar || registrando} className="w-full">
          <ShoppingCart size={17} />
          {registrando ? "Registrando..." : "Registrar venta"}
        </Boton>
      </div>

      {/* Historial */}
      <div className="px-4 mt-7">
        <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-2.5">
          Ventas recientes
        </p>
        <div className="flex flex-col gap-2.5">
          {cargandoVentas ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-[70px] rounded-tag bg-paper-dark animate-pulse" />)
          ) : ventas.length === 0 ? (
            <p className="text-sm text-ink-soft font-body text-center py-8">Todavía no hay ventas registradas.</p>
          ) : (
            ventas.slice(0, 20).map((v, i) => <VentaCard key={v.id} venta={v} index={i} onAbrir={setVentaActiva} />)
          )}
        </div>
      </div>

      {/* Detalle de venta */}
      <BottomSheet
        abierto={!!ventaActiva}
        onClose={() => setVentaActiva(null)}
        titulo={ventaActiva?.cliente?.nombre || "Venta anónima"}
        etiquetaEsquina={ventaActiva ? `ID ${ventaActiva.id}` : null}
      >
        {ventaActiva && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {ventaActiva.items?.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm font-body">
                  <span className="text-ink truncate pr-2">
                    {it.producto?.nombre} <span className="text-ink-soft">× {it.cantidad}</span>
                  </span>
                  <span className="font-mono text-ink shrink-0">
                    S/ {(Number(it.precioUnitario) * Number(it.cantidad)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone pt-3 flex items-center justify-between">
              <span className="font-body font-semibold text-ink-soft text-sm">Total</span>
              <span className="font-mono font-bold text-lg text-ink">S/ {Number(ventaActiva.montoTotal).toFixed(2)}</span>
            </div>
            <p className="text-xs text-ink-soft font-body">
              {ventaActiva.metodoPago} · {new Date(ventaActiva.fecha).toLocaleString("es-PE")}
              {ventaActiva.estado === "ANULADA" && " · Anulada"}
            </p>
            {ventaActiva.estado === "REGISTRADA" && (
              <Boton variante="peligro" onClick={() => setConfirmacionAnular(ventaActiva)} className="w-full">
                Anular venta
              </Boton>
            )}
          </div>
        )}
      </BottomSheet>

      <ConfirmDialog
        abierto={!!confirmacionAnular}
        titulo="¿Anular venta?"
        mensaje="El stock de los productos vendidos se restituirá y la venta quedará marcada como anulada."
        variante="peligro"
        textoConfirmar="Anular"
        onConfirmar={anularVenta}
        onCancelar={() => setConfirmacionAnular(null)}
      />
    </div>
  );
}
