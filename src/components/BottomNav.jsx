import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, CircleUser, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const itemBase =
  "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-body font-medium transition-colors";

export default function BottomNav() {
  const { esAdmin } = useAuth();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-paper-card border-t border-stone flex pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación principal"
    >
      <NavLink
        to="/productos"
        className={({ isActive }) =>
          `${itemBase} ${isActive ? "text-awning" : "text-ink-soft/60"}`
        }
      >
        {({ isActive }) => (
          <>
            <Package size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            Productos
          </>
        )}
      </NavLink>

      <NavLink
        to="/ventas"
        className={({ isActive }) =>
          `${itemBase} ${isActive ? "text-awning" : "text-ink-soft/60"}`
        }
      >
        {({ isActive }) => (
          <>
            <ShoppingCart size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            Ventas
          </>
        )}
      </NavLink>

      {esAdmin && (
        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            `${itemBase} ${isActive ? "text-awning" : "text-ink-soft/60"}`
          }
        >
          {({ isActive }) => (
            <>
              <Users size={22} strokeWidth={isActive ? 2.4 : 1.8} />
              Usuarios
            </>
          )}
        </NavLink>
      )}

      {esAdmin && (
        <NavLink
          to="/ganancias"
          className={({ isActive }) =>
            `${itemBase} ${isActive ? "text-awning" : "text-ink-soft/60"}`
          }
        >
          {({ isActive }) => (
            <>
              <TrendingUp size={22} strokeWidth={isActive ? 2.4 : 1.8} />
              Ganancias
            </>
          )}
        </NavLink>
      )}

      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          `${itemBase} ${isActive ? "text-awning" : "text-ink-soft/60"}`
        }
      >
        {({ isActive }) => (
          <>
            <CircleUser size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            Perfil
          </>
        )}
      </NavLink>
    </nav>
  );
}
