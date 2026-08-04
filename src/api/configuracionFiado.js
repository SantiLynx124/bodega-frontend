import { api } from "./client";

export const configuracionFiadoApi = {
  obtener: () => api.get("/configuracion/fiado").then((r) => r.data),
  actualizar: (config) => api.put("/configuracion/fiado", config).then((r) => r.data),
};
