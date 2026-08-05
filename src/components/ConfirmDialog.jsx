import { Boton } from "./Field";

export default function ConfirmDialog({ abierto, titulo, mensaje, onConfirmar, onCancelar, variante = "primario", textoConfirmar = "Confirmar" }) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <button aria-label="Cerrar" onClick={onCancelar} className="absolute inset-0 bg-ink/50 animate-fade-in" />
      <div role="alertdialog" aria-modal="true" className="relative w-full max-w-xs bg-paper-card rounded-2xl shadow-sheet p-5 animate-fade-in">
        <h3 className="font-display font-semibold text-base text-ink mb-1.5">{titulo}</h3>
        <p className="text-sm text-ink-soft font-body mb-5">{mensaje}</p>
        <div className="flex gap-2 justify-end">
          <Boton variante="fantasma" onClick={onCancelar}>Cancelar</Boton>
          <Boton variante={variante} onClick={onConfirmar}>{textoConfirmar}</Boton>
        </div>
      </div>
    </div>
  );
}
