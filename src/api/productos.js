import { api } from "./client";

export const productosApi = {
  listar: () => api.get("/productos/listar").then((r) => r.data),
  listarDesactivados: () => api.get("/productos/listar-desactivados").then((r) => r.data),
  buscarNombre: (nombre) => api.get("/productos/buscar", { params: { nombre } }).then((r) => r.data),
  buscarId: (id) => api.get(`/productos/${id}`).then((r) => r.data),
  registrar: (producto) => api.post("/productos", producto).then((r) => r.data),
  actualizar: (id, producto) => api.put(`/productos/${id}`, producto).then((r) => r.data),
  activar: (id) => api.patch(`/productos/${id}/activar`).then((r) => r.data),
  desactivar: (id) => api.patch(`/productos/${id}/desactivar`).then((r) => r.data),
  aumentarStock: (id, cantidad) =>
    api.patch(`/productos/${id}/aumentar-stock`, null, { params: { cantidad } }).then((r) => r.data),
  disminuirStock: (id, cantidad) =>
    api.patch(`/productos/${id}/disminuir-stock`, null, { params: { cantidad } }).then((r) => r.data),
};
