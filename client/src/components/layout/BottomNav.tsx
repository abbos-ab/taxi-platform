import React from 'react';
import { NavLink } from 'react-router-dom';
import { ru } from '../../i18n/ru';

const navItems = [
  { to: '/', label: ru.tabs.home, icon: '🏠' },
  { to: '/history', label: ru.tabs.history, icon: '📋' },
  { to: '/profile', label: ru.tabs.profile, icon: '👤' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 sm:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors
              ${isActive ? 'text-accent' : 'text-text-secondary'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
