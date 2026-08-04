import { useEffect, useState } from "react";
import { Campo, Input, Boton } from "./Field";

export default function ConfiguracionFiadoForm({ config, onGuardar, guardando }) {
  const [limite, setLimite] = useState(String(config.limiteFiadoGlobal));
  const [habilitado, setHabilitado] = useState(config.fiadoHabilitadoGlobal);

  useEffect(() => {
    setLimite(String(config.limiteFiadoGlobal));
    setHabilitado(config.fiadoHabilitadoGlobal);
  }, [config]);

  function onSubmit(e) {
    e.preventDefault();
    onGuardar({ limiteFiadoGlobal: Number(limite), fiadoHabilitadoGlobal: habilitado });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft font-body">
        Este límite aplica a todos los clientes que no tengan un tope individual definido.
      </p>
      <Campo label="Límite de fiado global (S/)">
        <Input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          required
        />
      </Campo>

      <div className="flex items-center justify-between bg-paper rounded-tag border border-stone px-3.5 py-3">
        <div>
          <p className="font-body text-sm font-semibold text-ink">Fiado habilitado globalmente</p>
          <p className="text-xs text-ink-soft font-body">Si se apaga, no se podrá vender al fiado a nadie.</p>
        </div>
        <button
          type="button"
          onClick={() => setHabilitado((h) => !h)}
          aria-pressed={habilitado}
          className={`shrink-0 w-11 h-6 rounded-full relative transition-colors ${
            habilitado ? "bg-awning" : "bg-stone"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              habilitado ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <Boton type="submit" disabled={guardando} className="w-full">
        {guardando ? "Guardando..." : "Guardar configuración"}
      </Boton>
    </form>
  );
}
