import { useEffect, useMemo, useState, useCallback } from "react";
import TopBar from "../components/TopBar";
import { ventasApi } from "../api/ventas";
import { extraerMensajeError } from "../api/client";
import { useToast } from "../context/ToastContext";

const RANGOS = [
  { id: "hoy", label: "Hoy" },
  { id: "semana", label: "7 días" },
  { id: "mes", label: "Este mes" },
  { id: "todo", label: "Todo" },
];

function inicioDe(rango) {
  const ahora = new Date();
  if (rango === "hoy") return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  if (rango === "semana") {
    const d = new Date(ahora);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (rango === "mes") return new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  return null; // todo
}

// Costo de una venta: suma de (cantidad * precioCompra) de cada ítem.
// Si un producto no tiene precioCompra registrado, ese ítem no aporta costo
// (se contabiliza como "sin dato" para poder avisar que la ganancia real puede ser menor).
function calcularVenta(venta) {
  let costo = 0;
  let faltaCosto = false;
  for (const it of venta.items || []) {
    const precioCompra = it.producto?.precioCompra;
    if (precioCompra == null) {
      faltaCosto = true;
      continue;
    }
    costo += Number(precioCompra) * Number(it.cantidad);
  }
  const ingreso = Number(venta.montoTotal);
  return { ingreso, costo, ganancia: ingreso - costo, faltaCosto };
}

function formatearDiaCorto(fecha) {
  return new Date(fecha).toLocaleDateString("es-PE", { weekday: "short" }).replace(".", "");
}

export default function Ganancias() {
  const toast = useToast();
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [rango, setRango] = useState("semana");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await ventasApi.listar();
      setVentas(data);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ventasValidas = useMemo(() => ventas.filter((v) => v.estado !== "ANULADA"), [ventas]);

  const filtradas = useMemo(() => {
    const desde = inicioDe(rango);
    if (!desde) return ventasValidas;
    return ventasValidas.filter((v) => new Date(v.fecha) >= desde);
  }, [ventasValidas, rango]);

  const resumen = useMemo(() => {
    let ingreso = 0,
      costo = 0,
      ganancia = 0,
      faltaCosto = false;
    for (const v of filtradas) {
      const c = calcularVenta(v);
      ingreso += c.ingreso;
      costo += c.costo;
      ganancia += c.ganancia;
      faltaCosto = faltaCosto || c.faltaCosto;
    }
    return { ingreso, costo, ganancia, faltaCosto, cantidad: filtradas.length };
  }, [filtradas]);

  // Últimos 7 días para la barra, siempre sobre ventasValidas (no sobre el filtro de rango)
  const ultimos7dias = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(d.getDate() - i);
      const siguiente = new Date(d);
      siguiente.setDate(siguiente.getDate() + 1);
      const ventasDelDia = ventasValidas.filter((v) => {
        const f = new Date(v.fecha);
        return f >= d && f < siguiente;
      });
      const ganancia = ventasDelDia.reduce((acc, v) => acc + calcularVenta(v).ganancia, 0);
      dias.push({ fecha: d, ganancia });
    }
    return dias;
  }, [ventasValidas]);

  const maxGanancia = Math.max(1, ...ultimos7dias.map((d) => Math.abs(d.ganancia)));

  return (
    <div className="min-h-[100dvh] bg-paper pb-24">
      <TopBar titulo="Ganancias" subtitulo="Calculado sobre tus ventas registradas" />

      <div className="px-4 pt-4 flex flex-col gap-5">
        {/* Selector de rango */}
        <div className="flex gap-1.5 bg-paper-dark rounded-tag p-1">
          {RANGOS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRango(r.id)}
              className={`flex-1 rounded-tag py-1.5 text-xs font-body font-semibold transition-colors ${
                rango === r.id ? "bg-paper-card text-ink shadow-card" : "text-ink-soft"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="h-32 rounded-tag bg-paper-dark animate-pulse" />
        ) : (
          <>
            {/* Tarjeta principal de ganancia */}
            <div className="bg-awning rounded-tag shadow-card px-5 py-5 text-paper">
              <p className="text-xs font-body uppercase tracking-wide text-paper/70 mb-1">
                Ganancia ({resumen.cantidad} {resumen.cantidad === 1 ? "venta" : "ventas"})
              </p>
              <p className="font-mono font-bold text-3xl">S/ {resumen.ganancia.toFixed(2)}</p>
            </div>

            {/* Ingresos y costo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-paper-card rounded-tag shadow-card px-4 py-3">
                <p className="text-[11px] font-body uppercase tracking-wide text-ink-soft mb-1">Ingresos</p>
                <p className="font-mono font-semibold text-lg text-ink">S/ {resumen.ingreso.toFixed(2)}</p>
              </div>
              <div className="bg-paper-card rounded-tag shadow-card px-4 py-3">
                <p className="text-[11px] font-body uppercase tracking-wide text-ink-soft mb-1">Costo</p>
                <p className="font-mono font-semibold text-lg text-tag-red">S/ {resumen.costo.toFixed(2)}</p>
              </div>
            </div>

            {resumen.faltaCosto && (
              <p className="text-xs text-tag-mustard bg-tag-mustard/10 border border-tag-mustard/30 rounded-tag px-3 py-2 font-body">
                Algunos productos vendidos no tienen precio de compra registrado — la ganancia real de esas
                ventas puede ser menor a la mostrada. Edítalos en Productos para un cálculo exacto.
              </p>
            )}

            {/* Barra de últimos 7 días */}
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-2">
                Últimos 7 días
              </p>
              <div className="bg-paper-card rounded-tag shadow-card px-4 py-4 flex items-end justify-between gap-2 h-32">
                {ultimos7dias.map((d, i) => {
                  const alto = Math.max(4, (Math.abs(d.ganancia) / maxGanancia) * 88);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                      <div
                        style={{ height: `${alto}px` }}
                        className={`w-full rounded-t-tag ${d.ganancia < 0 ? "bg-tag-red" : "bg-awning"}`}
                        title={`S/ ${d.ganancia.toFixed(2)}`}
                      />
                      <span className="text-[10px] font-body text-ink-soft capitalize">
                        {formatearDiaCorto(d.fecha)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de ventas del rango, con ganancia individual */}
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-2">
                Detalle
              </p>
              {filtradas.length === 0 ? (
                <p className="text-sm text-ink-soft font-body text-center py-8">
                  No hay ventas en este rango.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {filtradas
                    .slice()
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 30)
                    .map((v) => {
                      const c = calcularVenta(v);
                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between bg-paper-card rounded-tag shadow-card px-3.5 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-body font-semibold text-ink truncate">
                              {v.cliente?.nombre || "Cliente anónimo"}
                            </p>
                            <p className="text-[11px] text-ink-soft font-body truncate">
                              {v.usuario?.nombre ? `Vendió: ${v.usuario.nombre} · ` : ""}
                              {new Date(v.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                            </p>
                          </div>
                          <span className="font-mono font-semibold text-sm text-awning shrink-0">
                            +S/ {c.ganancia.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
