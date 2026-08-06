import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CarritoItem({ item, onCambiarCantidad, onQuitar }) {
  const esKilo = item.unidadMetrica === "KILOGRAMO";
  const paso = esKilo ? 0.1 : 1;
  const subtotal = item.precioVenta * item.cantidad;

  // Texto local del input, para permitir escribir libremente (ej. "1." o "" mientras se edita)
  const [texto, setTexto] = useState(String(item.cantidad));

  useEffect(() => {
    setTexto(String(item.cantidad));
  }, [item.cantidad]);

  function ajustar(delta) {
    const nueva = Math.round((item.cantidad + delta) * 100) / 100;
    if (nueva <= 0) return onQuitar(item.productoId);
    onCambiarCantidad(item.productoId, nueva);
  }

  function aplicarTexto(valor) {
    const normalizado = valor.replace(",", ".");
    const numero = parseFloat(normalizado);
    if (isNaN(numero) || numero <= 0) {
      // Si queda vacío o inválido al salir del campo, restauramos el valor anterior
      setTexto(String(item.cantidad));
      return;
    }
    const redondeado = esKilo ? Math.round(numero * 100) / 100 : Math.round(numero);
    setTexto(String(redondeado));
    onCambiarCantidad(item.productoId, redondeado);
  }

  return (
    <div className="flex items-center gap-2.5 bg-paper-card rounded-tag shadow-card px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-sm text-ink truncate">{item.nombre}</p>
        <p className="text-xs text-ink-soft font-mono">
          S/ {item.precioVenta.toFixed(2)} × {item.cantidad}
          {esKilo ? "kg" : "u."} = S/ {subtotal.toFixed(2)}
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
        <input
          type="text"
          inputMode="decimal"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onBlur={(e) => aplicarTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
          }}
          onFocus={(e) => e.target.select()}
          aria-label="Cantidad"
          className="font-mono text-sm text-ink w-14 text-center bg-paper rounded-md border border-stone py-1 focus:outline-none focus:ring-2 focus:ring-awning/50"
        />
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
