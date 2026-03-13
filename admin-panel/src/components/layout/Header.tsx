import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Панель управления
      </Typography.Title>
      <Space>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Выйти
        </Button>
      </Space>
    </Header>
  );
};
