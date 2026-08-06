import { api } from "./client";

export const ventasApi = {
  listar: () => api.get("/ventas").then((r) => r.data),
  buscarId: (id) => api.get(`/ventas/${id}`).then((r) => r.data),
  porCliente: (clienteId) => api.get(`/ventas/cliente/${clienteId}`).then((r) => r.data),
  registrar: (venta) => api.post("/ventas", venta).then((r) => r.data),
  anular: (id) => api.patch(`/ventas/${id}/anular`).then((r) => r.data),
};
