import { api } from "./client";

export const clientesApi = {
  listar: () => api.get("/clientes/listar").then((r) => r.data),
  buscarId: (id) => api.get(`/clientes/${id}`).then((r) => r.data),
  buscarNombre: (nombre) => api.get("/clientes/buscar", { params: { nombre } }).then((r) => r.data),
  registrar: (cliente) => api.post("/clientes", cliente).then((r) => r.data),
  actualizar: (id, cliente) => api.put(`/clientes/${id}`, cliente).then((r) => r.data),
  activar: (id) => api.patch(`/clientes/${id}/activar`).then((r) => r.data),
  desactivar: (id) => api.patch(`/clientes/${id}/desactivar`).then((r) => r.data),

  verCuentaFiado: (id) => api.get(`/clientes/${id}/cuenta-fiado`).then((r) => r.data),
  actualizarTope: (id, tope) =>
    api.patch(`/clientes/${id}/cuenta-fiado/tope`, { tope }).then((r) => r.data),
  activarFiado: (id) => api.patch(`/clientes/${id}/cuenta-fiado/activar`).then((r) => r.data),
  desactivarFiado: (id) => api.patch(`/clientes/${id}/cuenta-fiado/desactivar`).then((r) => r.data),
  registrarAbono: (id, monto) =>
    api.post(`/clientes/${id}/cuenta-fiado/abono`, { monto }).then((r) => r.data),
};
