import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);

const CLAVE_STORAGE = "bodega:carrito";

function cargarInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (!guardado) return null;
    return JSON.parse(guardado);
  } catch {
    return null;
  }
}

export function CarritoProvider({ children }) {
  const inicial = cargarInicial();

  const [carrito, setCarrito] = useState(inicial?.carrito ?? []);
  const [metodoPago, setMetodoPago] = useState(inicial?.metodoPago ?? "CONTADO");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(inicial?.clienteSeleccionado ?? null);

  // Persistimos cualquier cambio para que el carrito sobreviva a navegación entre
  // pantallas (registrar cliente, buscar producto, etc.) e incluso a recargar la página.
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify({ carrito, metodoPago, clienteSeleccionado })
      );
    } catch {
      // Si localStorage no está disponible (modo privado, cuota llena, etc.) seguimos sin persistir
    }
  }, [carrito, metodoPago, clienteSeleccionado]);

  function agregarProducto(p) {
    setCarrito((c) => {
      const existe = c.find((it) => it.productoId === p.id);
      if (existe) {
        const paso = p.unidadMetrica === "KILOGRAMO" ? 0.1 : 1;
        return c.map((it) =>
          it.productoId === p.id ? { ...it, cantidad: Math.round((it.cantidad + paso) * 100) / 100 } : it
        );
      }
      return [
        ...c,
        {
          productoId: p.id,
          nombre: p.nombre,
          precioVenta: Number(p.precioVenta),
          unidadMetrica: p.unidadMetrica,
          cantidad: p.unidadMetrica === "KILOGRAMO" ? 0.1 : 1,
        },
      ];
    });
  }

  function cambiarCantidad(productoId, cantidad) {
    setCarrito((c) => c.map((it) => (it.productoId === productoId ? { ...it, cantidad } : it)));
  }

  function quitarDelCarrito(productoId) {
    setCarrito((c) => c.filter((it) => it.productoId !== productoId));
  }

  function vaciarCarrito() {
    setCarrito([]);
    setMetodoPago("CONTADO");
    setClienteSeleccionado(null);
  }

  const value = {
    carrito,
    metodoPago,
    clienteSeleccionado,
    setMetodoPago,
    setClienteSeleccionado,
    agregarProducto,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
