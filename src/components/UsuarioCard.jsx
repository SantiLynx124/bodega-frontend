const rolEtiqueta = {
  ADMINISTRADOR: { texto: "Administrador", color: "bg-tag-red" },
  VENDEDOR: { texto: "Vendedor", color: "bg-awning" },
};

export default function UsuarioCard({ usuario, onAbrir, index = 0 }) {
  const rol = rolEtiqueta[usuario.rol] || { texto: usuario.rol, color: "bg-ink-soft" };
  const desactivado = !usuario.estado;
  return (
    <button
      onClick={() => onAbrir(usuario)}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
      className={`stagger-item w-full flex items-center gap-3 bg-paper-card rounded-tag shadow-card px-3.5 py-3 text-left active:scale-[0.99] transition-transform ${
        desactivado ? "opacity-60" : ""
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-awning/10 text-awning flex items-center justify-center font-display font-bold shrink-0">
        {usuario.nombre?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold text-[15px] text-ink truncate">{usuario.nombre}</p>
        <p className="text-xs text-ink-soft font-body truncate">
          @{usuario.usuario}
          {desactivado && " · Desactivado"}
        </p>
      </div>
      <span className={`text-[10px] font-body font-semibold uppercase tracking-wide text-paper px-2 py-1 rounded-tag shrink-0 ${rol.color}`}>
        {rol.texto}
      </span>
    </button>
  );
}
