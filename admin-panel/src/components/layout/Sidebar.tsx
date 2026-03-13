import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';

const { Sider } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Дашборд' },
  { key: '/rides', icon: <CarOutlined />, label: 'Поездки' },
  { key: '/drivers', icon: <UserOutlined />, label: 'Водители' },
  { key: '/passengers', icon: <TeamOutlined />, label: 'Пассажиры' },
  { key: '/pricing', icon: <DollarOutlined />, label: 'Тарифы' },
  { key: '/live-map', icon: <EnvironmentOutlined />, label: 'Live карта' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Отчёты' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={useAppStore.getState().toggleSidebar}
      style={{ background: '#1e293b' }}
      theme="dark"
    >
      <div style={{ padding: '16px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: collapsed ? 14 : 18 }}>
        {collapsed ? 'TT' : 'TURB TAXI'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: '#1e293b' }}
      />
    </Sider>
  );
};
