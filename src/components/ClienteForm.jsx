import { useState } from "react";
import { Campo, Input, Boton } from "./Field";

const vacio = { nombre: "", telefono: "", descripcion: "" };

export default function ClienteForm({ inicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(inicial ? { ...vacio, ...inicial } : vacio);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onSubmit(e) {
    e.preventDefault();
    onGuardar({
      ...form,
      telefono: form.telefono?.trim() ? form.telefono.trim() : null,
      descripcion: form.descripcion?.trim() ? form.descripcion.trim() : null,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Campo label="Nombre">
        <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required maxLength={100} />
      </Campo>
      <Campo label="Teléfono (opcional)">
        <Input
          value={form.telefono || ""}
          onChange={(e) => set("telefono", e.target.value)}
          maxLength={10}
          inputMode="numeric"
        />
      </Campo>
      <Campo label="Descripción (opcional)">
        <Input value={form.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)} maxLength={255} />
      </Campo>
      <div className="flex gap-2 mt-2">
        <Boton type="button" variante="fantasma" onClick={onCancelar} className="flex-1">
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando} className="flex-1">
          {guardando ? "Guardando..." : "Guardar"}
        </Boton>
      </div>
    </form>
  );
}
