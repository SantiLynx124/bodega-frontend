import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Boton } from "./Field";

export default function AjusteStock({ unidadMetrica, onAjustar, procesando }) {
  const [cantidad, setCantidad] = useState("");
  const paso = unidadMetrica === "KILOGRAMO" ? "0.01" : "1";

  function ejecutar(tipo) {
    const n = Number(cantidad);
    if (!cantidad || n <= 0) return;
    onAjustar(tipo, n);
    setCantidad("");
  }

  return (
    <div className="bg-paper rounded-tag border border-stone p-3">
      <p className="text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-2">
        Movimiento de stock
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={paso}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad"
          className="flex-1 min-w-0 rounded-tag border border-stone bg-white px-3 py-2 text-[15px] font-mono text-ink focus:border-awning focus:ring-1 focus:ring-awning outline-none"
        />
        <Boton
          type="button"
          variante="secundario"
          disabled={procesando}
          onClick={() => ejecutar("disminuir")}
          aria-label="Disminuir stock"
        >
          <Minus size={16} />
        </Boton>
        <Boton
          type="button"
          disabled={procesando}
          onClick={() => ejecutar("aumentar")}
          aria-label="Aumentar stock"
        >
          <Plus size={16} />
        </Boton>
      </div>
    </div>
  );
}
