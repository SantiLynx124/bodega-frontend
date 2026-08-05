const metodoEtiqueta = {
  CONTADO: { texto: "Contado", color: "bg-awning" },
  YAPE: { texto: "Yape", color: "bg-[#742284]" },
  FIADO: { texto: "Fiado", color: "bg-tag-mustard" },
};

function formatearFecha(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }) + " · " +
    d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export default function VentaCard({ venta, onAbrir, index = 0 }) {
  const metodo = metodoEtiqueta[venta.metodoPago] || { texto: venta.metodoPago, color: "bg-ink-soft" };
  const anulada = venta.estado === "ANULADA";

  return (
    <button
      onClick={() => onAbrir(venta)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
      className={`stagger-item w-full flex items-stretch bg-paper-card rounded-tag shadow-card overflow-hidden text-left active:scale-[0.99] transition-transform ${
        anulada ? "opacity-60" : ""
      }`}
    >
      <div className={`w-1.5 shrink-0 ${anulada ? "bg-ink-soft" : metodo.color}`} aria-hidden />
      <div className="flex-1 px-3.5 py-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-semibold text-[15px] text-ink truncate">
              {venta.cliente?.nombre || "Cliente anónimo"}
            </p>
            <p className="text-xs text-ink-soft font-body truncate">{formatearFecha(venta.fecha)}</p>
          </div>
          <p className="font-mono font-semibold text-sm text-ink shrink-0">S/ {Number(venta.montoTotal).toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-[10px] font-body font-semibold uppercase tracking-wide text-paper px-2 py-1 rounded-tag ${metodo.color}`}>
            {metodo.texto}
          </span>
<<<<<<< HEAD
          <span className="text-[11px] font-body text-ink-soft truncate max-w-[45%]">
            {venta.usuario?.nombre ? `Vendió: ${venta.usuario.nombre}` : ""}
          </span>
          {anulada && <span className="text-[11px] font-body text-tag-red font-semibold shrink-0">Anulada</span>}
=======
          {anulada && <span className="text-[11px] font-body text-tag-red font-semibold">Anulada</span>}
>>>>>>> 72f8a438f94b579ea22a14572469716337a229e7
        </div>
      </div>
    </button>
  );
}
