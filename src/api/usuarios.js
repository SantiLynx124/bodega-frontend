import { api } from "./client";

export const usuariosApi = {
  listar: () => api.get("/usuarios/listar").then((r) => r.data),
  buscarId: (id) => api.get(`/usuarios/${id}`).then((r) => r.data),
  buscarUsuario: (usuario) => api.get("/usuarios/buscar", { params: { usuario } }).then((r) => r.data),
  registrar: (usuario) => api.post("/usuarios", usuario).then((r) => r.data),
  actualizar: (id, usuario) => api.put(`/usuarios/${id}`, usuario).then((r) => r.data),
  activar: (id) => api.patch(`/usuarios/${id}/activar`).then((r) => r.data),
  desactivar: (id) => api.patch(`/usuarios/${id}/desactivar`).then((r) => r.data),
  cambiarPassword: (id, password) => api.patch(`/usuarios/${id}/password`, { password }).then((r) => r.data),
  cambiarUsuario: (id, usuario) => api.patch(`/usuarios/${id}/usuario`, { usuario }).then((r) => r.data),
  cambiarMiPassword: (password) => api.patch("/usuarios/me/contrase%C3%B1a", { password }).then((r) => r.data),
  cambiarMiUsuario: (usuario) => api.patch("/usuarios/me/usuario", { usuario }).then((r) => r.data),
};
