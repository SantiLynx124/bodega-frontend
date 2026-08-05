import { useState } from "react";
import { Campo, Input, Boton } from "./Field";

export default function CuentaFiadoPanel({ cuenta, configGlobal, onActualizarTope, onToggleHabilitado, onAbono, procesando }) {
  const [topeInput, setTopeInput] = useState(
    cuenta.topeIndividual != null ? String(cuenta.topeIndividual) : ""
  );
  const [monto, setMonto] = useState("");

  const topeEfectivo =
    cuenta.topeIndividual != null ? Number(cuenta.topeIndividual) : Number(configGlobal?.limiteFiadoGlobal ?? 0);
  const saldo = Number(cuenta.saldo);
  const disponible = Math.max(topeEfectivo - saldo, 0);

  function guardarTope(e) {
    e.preventDefault();
    onActualizarTope(topeInput.trim() === "" ? null : Number(topeInput));
  }

  function registrarAbono(e) {
    e.preventDefault();
    const n = Number(monto);
    if (!monto || n <= 0) return;
    onAbono(n);
    setMonto("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3.5 bg-paper rounded-tag border border-stone p-3.5">
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-wide text-ink-soft/70 mb-0.5">
            Deuda actual
          </p>
          <p className="font-mono font-semibold text-lg text-tag-red">S/ {saldo.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-wide text-ink-soft/70 mb-0.5">
            Disponible
          </p>
          <p className="font-mono font-semibold text-lg text-awning">S/ {disponible.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-paper rounded-tag border border-stone px-3.5 py-3">
        <div>
          <p className="font-body text-sm font-semibold text-ink">Fiado habilitado</p>
          <p className="text-xs text-ink-soft font-body">Permite registrar ventas al fiado para este cliente</p>
        </div>
        <button
          onClick={onToggleHabilitado}
          disabled={procesando}
          aria-pressed={cuenta.fiadoHabilitado}
          aria-label="Alternar fiado habilitado"
          className={`shrink-0 w-11 h-6 rounded-full relative transition-colors ${
            cuenta.fiadoHabilitado ? "bg-awning" : "bg-stone"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              cuenta.fiadoHabilitado ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <form onSubmit={guardarTope} className="border-t border-stone pt-4">
        <Campo label={`Tope individual (S/) · global actual: S/ ${Number(configGlobal?.limiteFiadoGlobal ?? 0).toFixed(2)}`}>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={topeInput}
            onChange={(e) => setTopeInput(e.target.value)}
            placeholder="Vacío = usar tope global"
          />
        </Campo>
        <Boton type="submit" variante="secundario" disabled={procesando} className="w-full">
          Guardar tope
        </Boton>
      </form>

      <form onSubmit={registrarAbono} className="border-t border-stone pt-4">
        <Campo label="Registrar abono (S/)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max={saldo}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
          />
        </Campo>
        <Boton type="submit" disabled={procesando || saldo <= 0} className="w-full">
          Registrar abono
        </Boton>
        {saldo <= 0 && <p className="text-xs text-ink-soft font-body mt-2">Este cliente no tiene deuda pendiente.</p>}
      </form>
    </div>
  );
}
