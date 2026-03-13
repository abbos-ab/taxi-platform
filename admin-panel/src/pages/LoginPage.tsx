import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      const res = await authApi.login(values.phone, values.password);
      login(res.data.access);
      navigate('/dashboard');
    } catch {
      message.error('Неверный телефон или пароль');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          TURB TAXI Admin
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Телефон" name="phone" rules={[{ required: true, message: 'Введите телефон' }]}>
            <Input placeholder="+992901234567" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
