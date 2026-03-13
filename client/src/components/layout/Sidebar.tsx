import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebarStore } from '../../store/useSidebarStore';
import { ru } from '../../i18n/ru';

const menuItems = [
  {
    to: '/',
    label: 'Заказ Такси',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'История заказов',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Профиль',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const { collapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-primary flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* Toggle + Logo */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 min-h-[66px]">
        <button
          onClick={toggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            {collapsed ? (
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            ) : (
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            )}
          </svg>
        </button>
        <span
          className={`text-lg font-bold text-white tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          }`}
        >
          {ru.app.name}
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.label}
            className={({ isActive }) =>
              `flex items-center h-11 rounded-xl font-medium transition-all duration-300 ease-in-out overflow-hidden
              ${collapsed ? 'justify-center px-0 gap-0' : 'px-4 text-sm gap-3'}
              ${isActive
                ? 'bg-accent text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span
              className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 overflow-hidden">
        <p
          className={`text-gray-500 whitespace-nowrap transition-all duration-300 ease-in-out ${
            collapsed ? 'text-[10px] text-center opacity-100' : 'text-xs px-1 opacity-100'
          }`}
        >
          {collapsed ? 'TT' : '\u00A9 2026 TURBO TAXI'}
        </p>
      </div>
    </aside>
  );
};
