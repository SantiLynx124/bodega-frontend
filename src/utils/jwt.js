// Decodifica el payload de un JWT en el navegador.
// No verifica la firma: eso ya lo hace el backend en cada request.
// Aquí solo lo usamos para leer usuario/rol y mostrar la UI correcta,
// y para saber si expiró y cerrar sesión localmente.
export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalizado = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalizado)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function tokenExpirado(claims) {
  if (!claims?.exp) return true;
  return Date.now() >= claims.exp * 1000;
}
