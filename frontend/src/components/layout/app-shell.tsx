"use client";

import { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ClipboardList,
  Clock,
  User,
  Star,
  HeadphonesIcon,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { path: "/", label: "Заказ такси", icon: Car },
  { path: "/orders", label: "Мои заказы", icon: ClipboardList },
  { path: "/history", label: "История поездок", icon: Clock },
  { path: "/profile", label: "Профиль", icon: User },
  { path: "/favorites", label: "Избранные адреса", icon: Star },
  { path: "/notifications", label: "Уведомления", icon: Bell },
  { path: "/support", label: "Поддержка", icon: HeadphonesIcon },
];

const SidebarContext = createContext({ expanded: true });
export const useSidebar = () => useContext(SidebarContext);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-[var(--primary)] text-white transition-all duration-300 ease-in-out ${
            expanded ? "w-[240px]" : "w-[68px]"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex items-center border-b border-white/10 px-3 py-4 ${
              expanded ? "gap-2.5" : "justify-center"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold">
              TT
            </div>
            {expanded && (
              <div className="overflow-hidden">
                <h1 className="text-[13px] font-semibold leading-tight">
                  TURB TAXI
                </h1>
                <p className="text-[10px] text-white/40">Сервис такси</p>
              </div>
            )}
          </div>

          {/* Toggle button */}
          <div className={`px-2 pt-2 ${expanded ? "" : "flex justify-center"}`}>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 ${
                expanded
                  ? "h-9 w-full gap-2 px-3 text-[12px] font-medium text-white/50"
                  : "h-9 w-9"
              }`}
              title={expanded ? "Свернуть меню" : "Развернуть меню"}
            >
              {expanded ? (
                <>
                  <PanelLeftClose className="h-5 w-5 text-white/50" />
                  <span>Свернуть</span>
                </>
              ) : (
                <PanelLeftOpen className="h-5 w-5 text-white/50" />
              )}
            </button>
          </div>

          {/* User avatar */}
          <div className={`mt-3 ${expanded ? "mx-3" : "flex justify-center"}`}>
            {expanded ? (
              <div className="rounded-lg bg-white/8 p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-semibold text-[var(--accent)]">
                    U
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium">
                      Пользователь
                    </div>
                    <div className="text-[10px] text-white/40">
                      +992 XX XXX XXXX
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-semibold text-[var(--accent)]"
                title="Пользователь"
              >
                U
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-3 flex-1 overflow-y-auto px-2">
            <ul className="flex flex-col gap-0.5">
              {menuItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <li key={item.path} className="relative">
                    <Link
                      href={item.path}
                      title={!expanded ? item.label : undefined}
                      className={`flex items-center rounded-lg transition-colors ${
                        expanded
                          ? "gap-2.5 px-3 py-2 text-[13px]"
                          : "justify-center py-2.5"
                      } font-medium ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/55 hover:bg-white/8 hover:text-white/90"
                      }`}
                    >
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2 : 1.5}
                        className="shrink-0"
                      />
                      {expanded && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                          )}
                        </>
                      )}
                    </Link>
                    {!expanded && isActive && (
                      <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-3">
            {expanded ? (
              <div className="rounded-md bg-white/5 px-2.5 py-2 text-center text-[10px] text-white/30">
                TURB TAXI v1.0
              </div>
            ) : (
              <div className="text-center text-[9px] text-white/20">v1.0</div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            expanded ? "ml-[240px]" : "ml-[68px]"
          }`}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
