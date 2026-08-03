import { useState } from "react";
import { Campo, Input, Select, Boton } from "./Field";

export default function UsuarioForm({ onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState({ nombre: "", usuario: "", password: "", rol: "VENDEDOR" });

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <form onSubmit={onSubmit}>
      <Campo label="Nombre completo">
        <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required maxLength={100} />
      </Campo>
      <Campo label="Usuario (para iniciar sesión)">
        <Input value={form.usuario} onChange={(e) => set("usuario", e.target.value)} required maxLength={20} />
      </Campo>
      <Campo label="Contraseña">
        <Input
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
          minLength={4}
        />
      </Campo>
      <Campo label="Rol">
        <Select value={form.rol} onChange={(e) => set("rol", e.target.value)}>
          <option value="VENDEDOR">Vendedor</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </Select>
      </Campo>
      <div className="flex gap-2 mt-2">
        <Boton type="button" variante="fantasma" onClick={onCancelar} className="flex-1">
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando} className="flex-1">
          {guardando ? "Guardando..." : "Crear usuario"}
        </Boton>
      </div>
    </form>
  );
}
