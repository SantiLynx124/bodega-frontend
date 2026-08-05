import { useState } from "react";
import { Campo, Input, Select, Boton } from "./Field";

const vacio = {
  nombre: "",
  marca: "",
  descripcion: "",
  unidadMetrica: "UNIDAD",
  precioVenta: "",
  precioCompra: "",
  stock: "",
};

export default function ProductoForm({ inicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(inicial ? { ...vacio, ...inicial } : vacio);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onSubmit(e) {
    e.preventDefault();
    onGuardar({
      ...form,
      precioVenta: Number(form.precioVenta),
      precioCompra: form.precioCompra === "" ? null : Number(form.precioCompra),
      stock: Number(form.stock),
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Campo label="Nombre">
        <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required maxLength={100} />
      </Campo>
      <Campo label="Marca">
        <Input value={form.marca} onChange={(e) => set("marca", e.target.value)} required maxLength={100} />
      </Campo>
      <Campo label="Descripción (opcional)">
        <Input value={form.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)} maxLength={255} />
      </Campo>
      <Campo label="Unidad de medida">
        <Select value={form.unidadMetrica} onChange={(e) => set("unidadMetrica", e.target.value)}>
          <option value="UNIDAD">Por unidad</option>
          <option value="KILOGRAMO">Por kilogramo</option>
        </Select>
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo label="Precio venta (S/)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.precioVenta}
            onChange={(e) => set("precioVenta", e.target.value)}
            required
          />
        </Campo>
        <Campo label="Precio compra (S/)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.precioCompra ?? ""}
            onChange={(e) => set("precioCompra", e.target.value)}
            placeholder="Opcional"
          />
        </Campo>
      </div>
      <Campo label={`Stock inicial ${form.unidadMetrica === "KILOGRAMO" ? "(kg)" : "(unidades)"}`}>
        <Input
          type="number"
          inputMode="decimal"
          step={form.unidadMetrica === "KILOGRAMO" ? "0.01" : "1"}
          min="0"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
          required
        />
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
