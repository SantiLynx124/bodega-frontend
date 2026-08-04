import AjusteStock from "./AjusteStock";

function Dato({ label, valor }) {
  return (
    <div>
      <p className="text-[11px] font-body font-semibold uppercase tracking-wide text-ink-soft/70 mb-0.5">
        {label}
      </p>
      <p className="font-body text-[15px] text-ink">{valor}</p>
    </div>
  );
}

export default function ProductoDetalle({ producto, onAjustar }) {
  const unidad = producto.unidadMetrica === "KILOGRAMO" ? "kg" : "unidades";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-body font-semibold uppercase tracking-wide text-paper px-2 py-1 rounded-tag ${
            producto.estado ? "bg-awning" : "bg-ink-soft"
          }`}
        >
          {producto.estado ? "Activo" : "Desactivado"}
        </span>
        <span className="text-xs text-ink-soft font-body">{producto.marca}</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 bg-paper rounded-tag border border-stone p-3.5">
        <Dato label="Precio venta" valor={`S/ ${Number(producto.precioVenta).toFixed(2)}`} />
        <Dato
          label="Precio compra"
          valor={producto.precioCompra != null ? `S/ ${Number(producto.precioCompra).toFixed(2)}` : "—"}
        />
        <Dato
          label="Stock actual"
          valor={`${Number(producto.stock).toFixed(producto.unidadMetrica === "KILOGRAMO" ? 2 : 0)} ${unidad}`}
        />
        <Dato label="Unidad de medida" valor={producto.unidadMetrica === "KILOGRAMO" ? "Kilogramo" : "Unidad"} />
      </div>

      {producto.descripcion && (
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-wide text-ink-soft/70 mb-0.5">
            Descripción
          </p>
          <p className="font-body text-sm text-ink-soft">{producto.descripcion}</p>
        </div>
      )}

      {producto.estado && <AjusteStock unidadMetrica={producto.unidadMetrica} onAjustar={onAjustar} />}
    </div>
  );
}
