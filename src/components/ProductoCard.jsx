const UMBRAL_BAJO = 5;

function nivelStock(stock) {
  const n = Number(stock);
  if (n <= 0) return { color: "bg-tag-red", texto: "Sin stock" };
  if (n <= UMBRAL_BAJO) return { color: "bg-tag-mustard", texto: "Stock bajo" };
  return { color: "bg-awning", texto: "En stock" };
}

export default function ProductoCard({ producto, onAbrir, index = 0 }) {
  const nivel = nivelStock(producto.stock);
  const unidad = producto.unidadMetrica === "KILOGRAMO" ? "kg" : "u.";

  return (
    <button
      onClick={() => onAbrir(producto)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
      className="stagger-item w-full flex items-stretch bg-paper-card rounded-tag shadow-card overflow-hidden text-left active:scale-[0.99] transition-transform"
    >
      <div className={`w-1.5 shrink-0 ${nivel.color}`} aria-hidden />
      <div className="flex-1 px-3.5 py-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-semibold text-[15px] text-ink truncate">{producto.nombre}</p>
            <p className="text-xs text-ink-soft font-body truncate">{producto.marca}</p>
          </div>
          <p className="font-mono font-semibold text-sm text-awning shrink-0">
            S/ {Number(producto.precioVenta).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] font-body text-ink-soft">{nivel.texto}</span>
          <span className="font-mono text-xs text-ink-soft">
            {Number(producto.stock).toFixed(producto.unidadMetrica === "KILOGRAMO" ? 2 : 0)} {unidad}
          </span>
        </div>
      </div>
    </button>
  );
}
