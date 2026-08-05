# Mi Bodega — Frontend

Frontend web para el sistema de control de inventario "Bodega" (backend Spring Boot). Pensado
mobile-first, priorizando Android, y funcional también en PC.

Stack: **React + Vite + Tailwind CSS** (sitio estático, ideal para el plan gratuito de Vercel).

## 1. Configurar la URL del backend

Todo el frontend habla con el backend a través de una sola variable de entorno:

```
VITE_API_URL=http://localhost:8080
```

Ya existe un archivo `.env` con ese valor para desarrollo local. Cuando muevas el backend a
Oracle Cloud, **no tocas código**: solo cambias esta variable.

## 2. Probar en local (backend en tu PC con XAMPP)

```bash
npm install
npm run dev
```

Esto abre el frontend en `http://localhost:5173`. Asegúrate de que tu backend Spring Boot esté
corriendo en `http://localhost:8080` (o ajusta `VITE_API_URL` en `.env` si usas otro puerto).

Para probarlo desde tu celular Android en la misma red Wi-Fi:
1. Averigua la IP local de tu PC (`ipconfig` en Windows, busca algo como `192.168.1.X`).
2. En `.env`, pon `VITE_API_URL=http://192.168.1.X:8080` (la IP de tu PC, puerto del backend).
3. Corre `npm run dev -- --host` y entra desde el celular a `http://192.168.1.X:5173`.
4. Verifica que el firewall de Windows permita conexiones a esos puertos.

## 3. Desplegar en Vercel (gratis)

1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com, "Add New Project" → importa el repo.
3. Vercel detecta Vite automáticamente (build command `npm run build`, output `dist`).
4. En **Project Settings → Environment Variables**, agrega:
   - `VITE_API_URL` = la URL pública donde esté tu backend en ese momento.
5. Deploy.

Importante: mientras el backend esté solo en tu PC (localhost), el frontend desplegado en
Vercel (en internet) no podrá alcanzarlo — `localhost` en Vercel se refiere a los servidores
de Vercel, no a tu PC. Para probar el sitio ya desplegado necesitas exponer tu backend a internet
(por ejemplo con un túnel como Cloudflare Tunnel o ngrok apuntando a tu puerto 8080) y poner esa
URL pública en `VITE_API_URL`. Cuando migres a Oracle Cloud, esto se resuelve solo: usas la IP o
dominio de tu instancia.

## 4. Migrar a Oracle Cloud más adelante

1. Despliega el backend y la base de datos en tu instancia de Oracle Cloud.
2. Abre el puerto del backend (ej. 8080) en las reglas de seguridad de red de Oracle Cloud.
3. Actualiza `VITE_API_URL` en Vercel con `http://<ip-o-dominio-oracle>:8080` y vuelve a
   desplegar (o simplemente "Redeploy" en Vercel, sin tocar código).
4. Revisa `SecurityConfig.java` en el backend: los CORS ya están abiertos a cualquier origen
   (`AllowedOriginPatterns("*")`), así que no necesitas tocar esa parte al cambiar de dominio.

## Estructura del proyecto

```
src/
  api/          Cliente HTTP (axios) y llamadas a /auth, /productos, /usuarios
  context/      Sesión (AuthContext) y notificaciones (ToastContext)
  components/   Piezas reutilizables: tarjetas, formularios, hoja modal, nav inferior
  pages/        Login, Productos, Usuarios (solo admin), Perfil
```

## Funcionalidades

- **Login** con JWT (el token se decodifica en el navegador solo para mostrar usuario/rol; la
  validación real de seguridad siempre ocurre en el backend).
- **Productos**: listar, buscar, crear, editar, activar/desactivar, y ajustar stock con
  botones rápidos de + / -. Como el backend solo lista productos activos, hay un buscador por
  ID para encontrar y reactivar productos desactivados.
- **Usuarios** (solo rol ADMINISTRADOR): listar, crear, editar nombre/rol, cambiar su usuario
  de acceso, restablecer contraseña, activar/desactivar.
- **Perfil**: cualquier usuario puede cambiar su propio usuario de acceso o contraseña, y cerrar
  sesión.

## Notas de diseño

Pensado para pantallas de Android en vertical: navegación inferior fija con pestañas grandes,
formularios en hojas que suben desde abajo (como los diálogos nativos de Android), botón flotante
(+) para crear registros, y tarjetas con una franja de color que indica el nivel de stock de un
vistazo (verde = bien, mostaza = bajo, rojo = agotado).
