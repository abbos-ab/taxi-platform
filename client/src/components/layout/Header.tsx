import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ru } from '../../i18n/ru';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-primary text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
      <Link to="/" className="text-xl font-bold tracking-wide">
        {ru.app.name}
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/history" className="text-sm hover:text-accent transition-colors">
          {ru.tabs.history}
        </Link>
        <Link to="/profile" className="text-sm hover:text-accent transition-colors">
          {user?.name || ru.tabs.profile}
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {ru.profile.logout}
          </button>
        )}
      </div>
    </header>
  );
};
