export function Campo({ label, error, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-body font-semibold uppercase tracking-wide text-ink-soft mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-tag-red mt-1 font-body">{error}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-tag border border-stone bg-white px-3.5 py-2.5 text-[15px] font-body text-ink placeholder:text-ink-soft/40 focus:border-awning focus:ring-1 focus:ring-awning outline-none transition-colors";

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Select(props) {
  return <select {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Boton({ variante = "primario", className = "", ...props }) {
  const estilos = {
    primario: "bg-awning text-paper hover:bg-awning-light active:bg-awning-dark disabled:opacity-50",
    secundario: "bg-transparent text-awning border border-awning hover:bg-awning/5 disabled:opacity-50",
    peligro: "bg-tag-red text-paper hover:bg-[#9c3226] disabled:opacity-50",
    fantasma: "bg-transparent text-ink-soft hover:bg-stone/50 disabled:opacity-50",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-tag px-4 py-2.5 text-sm font-body font-semibold transition-colors ${estilos[variante]} ${className}`}
    />
  );
}
