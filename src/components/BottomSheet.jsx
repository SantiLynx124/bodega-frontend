import { useEffect } from "react";
import { X } from "lucide-react";

export default function BottomSheet({ abierto, onClose, titulo, children }) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="relative w-full sm:max-w-md bg-paper-card rounded-t-2xl sm:rounded-2xl shadow-sheet max-h-[88vh] overflow-y-auto animate-slide-up pb-[calc(env(safe-area-inset-bottom)+16px)]"
      >
        <div className="sticky top-0 bg-paper-card flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone">
          <div className="mx-auto w-10 h-1.5 rounded-full bg-stone absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />
          <h2 className="font-display font-semibold text-lg text-ink mt-2">{titulo}</h2>
          <button
            onClick={onClose}
            className="mt-2 p-1.5 rounded-full text-ink-soft hover:bg-stone/60 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
