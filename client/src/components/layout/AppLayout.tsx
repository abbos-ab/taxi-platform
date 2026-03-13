import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../../store/useSidebarStore';

export const AppLayout: React.FC = () => {
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main
        className="flex-1 relative min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        <Outlet />
      </main>
    </div>
  );
};
