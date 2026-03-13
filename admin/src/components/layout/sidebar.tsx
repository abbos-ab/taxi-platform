import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCheck,
  Car,
  Banknote,
  Ticket,
  BarChart3,
  Map,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { path: "/", label: "Дашборд", icon: LayoutDashboard },
  { path: "/orders", label: "Заказы", icon: ClipboardList },
  { path: "/drivers", label: "Водители", icon: UserCheck },
  { path: "/clients", label: "Клиенты", icon: Users },
  { path: "/fleet", label: "Автопарк", icon: Car },
  { path: "/tariffs", label: "Тарифы", icon: Banknote },
  { path: "/promos", label: "Промокоды", icon: Ticket },
  { path: "/reports", label: "Отчёты", icon: BarChart3 },
  { path: "/map", label: "Карта", icon: Map },
  { path: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-[var(--color-primary)] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-sm">
          TT
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight">TURBO TAXI</h1>
          <p className="text-[11px] text-white/50">Панель управления</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/8 hover:text-white/90"
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-white/50 hover:bg-white/8 hover:text-white/80 transition-colors w-full">
          <LogOut size={18} strokeWidth={1.5} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
