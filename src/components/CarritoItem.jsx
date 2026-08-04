import { Minus, Plus, Trash2 } from "lucide-react";

export default function CarritoItem({ item, onCambiarCantidad, onQuitar }) {
  const paso = item.unidadMetrica === "KILOGRAMO" ? 0.1 : 1;
  const subtotal = item.precioVenta * item.cantidad;

  function ajustar(delta) {
    const nueva = Math.round((item.cantidad + delta) * 100) / 100;
    if (nueva <= 0) return onQuitar(item.productoId);
    onCambiarCantidad(item.productoId, nueva);
  }

  return (
    <div className="flex items-center gap-2.5 bg-paper-card rounded-tag shadow-card px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-sm text-ink truncate">{item.nombre}</p>
        <p className="text-xs text-ink-soft font-mono">
          S/ {item.precioVenta.toFixed(2)} × {item.cantidad}
          {item.unidadMetrica === "KILOGRAMO" ? "kg" : "u."} = S/ {subtotal.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => ajustar(-paso)}
          className="w-7 h-7 rounded-full bg-paper border border-stone flex items-center justify-center text-ink-soft active:scale-95"
          aria-label="Disminuir cantidad"
        >
          <Minus size={13} />
        </button>
        <span className="font-mono text-sm text-ink w-8 text-center">{item.cantidad}</span>
        <button
          type="button"
          onClick={() => ajustar(paso)}
          className="w-7 h-7 rounded-full bg-paper border border-stone flex items-center justify-center text-ink-soft active:scale-95"
          aria-label="Aumentar cantidad"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          onClick={() => onQuitar(item.productoId)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-tag-red/80 active:scale-95"
          aria-label="Quitar del carrito"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
