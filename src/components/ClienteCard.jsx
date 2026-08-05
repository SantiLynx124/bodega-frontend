export default function ClienteCard({ cliente, onAbrir, index = 0 }) {
  const desactivado = !cliente.estado;
  return (
    <button
      onClick={() => onAbrir(cliente)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
      className={`stagger-item w-full flex items-center gap-3 bg-paper-card rounded-tag shadow-card px-3.5 py-3 text-left active:scale-[0.99] transition-transform ${
        desactivado ? "opacity-60" : ""
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-tag-mustard/20 text-ink flex items-center justify-center font-display font-bold shrink-0">
        {cliente.nombre?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold text-[15px] text-ink truncate">{cliente.nombre}</p>
        <p className="text-xs text-ink-soft font-body truncate">
          {cliente.telefono || "Sin teléfono"}
          {desactivado && " · Desactivado"}
        </p>
      </div>
    </button>
  );
}
