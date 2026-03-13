import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, UserOutlined, CarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const keyframesStyle = `
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(30px, -40px) rotate(5deg); }
    50% { transform: translate(-20px, -80px) rotate(-3deg); }
    75% { transform: translate(40px, -30px) rotate(7deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-40px, 30px) rotate(-5deg); }
    66% { transform: translate(30px, -50px) rotate(3deg); }
  }
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -60px) scale(1.1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes logoReveal {
    from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .login-input .ant-input,
  .login-input .ant-input-password .ant-input {
    background: transparent !important;
  }
  .login-input .ant-input-affix-wrapper {
    background: rgba(255,255,255,0.08) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 14px !important;
    height: 54px !important;
    transition: all 0.3s ease !important;
  }
  .login-input .ant-input-affix-wrapper:hover {
    border-color: rgba(14, 165, 233, 0.5) !important;
    background: rgba(255,255,255,0.12) !important;
  }
  .login-input .ant-input-affix-wrapper-focused,
  .login-input .ant-input-affix-wrapper:focus {
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15) !important;
    background: rgba(255,255,255,0.15) !important;
  }
  .login-input .ant-input {
    color: #fff !important;
    font-size: 15px !important;
  }
  .login-input .ant-input::placeholder {
    color: rgba(255,255,255,0.4) !important;
  }
  .login-input .ant-input-suffix .anticon {
    color: rgba(255,255,255,0.4) !important;
  }
  .login-btn {
    height: 54px !important;
    border-radius: 14px !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    letter-spacing: 0.5px !important;
    background: linear-gradient(135deg, #0ea5e9, #06b6d4, #0ea5e9) !important;
    background-size: 200% auto !important;
    border: none !important;
    box-shadow: 0 8px 32px rgba(14, 165, 233, 0.45) !important;
    transition: all 0.3s ease !important;
  }
  .login-btn:hover {
    background-position: right center !important;
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.6) !important;
    transform: translateY(-2px) !important;
  }
  .login-btn:active {
    transform: translateY(0) !important;
  }
`;

export const LoginPage: React.FC = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(values.username, values.password);
      login(res.data.access);
      navigate('/dashboard');
    } catch {
      message.error('Неверный телефон или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0a0e27 0%, #0f1b3d 30%, #0c1a3a 60%, #091428 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%)',
            animation: 'float1 12s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '10%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)',
            animation: 'float2 15s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%)',
            animation: 'float3 10s ease-in-out infinite',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Small floating dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 4 + i * 2,
              height: 4 + i * 2,
              borderRadius: '50%',
              background: 'rgba(14, 165, 233, 0.4)',
              top: `${15 + i * 13}%`,
              left: `${10 + i * 15}%`,
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Login Card */}
        <div
          style={{
            width: 440,
            background: 'linear-gradient(145deg, rgba(15, 23, 60, 0.85), rgba(10, 17, 45, 0.9))',
            backdropFilter: 'blur(40px)',
            borderRadius: 28,
            padding: '52px 44px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '0 30px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1,
            animation: 'slideUp 0.8s ease-out',
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: 3,
              borderRadius: '0 0 4px 4px',
              background: 'linear-gradient(90deg, transparent, #0ea5e9, #06b6d4, transparent)',
            }}
          />

          {/* Logo section */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 22,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 12px 36px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                animation: 'logoReveal 0.6s ease-out 0.3s both',
                position: 'relative',
              }}
            >
              <CarOutlined style={{ fontSize: 40, color: '#fff' }} />
              {/* Glow ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: 26,
                  border: '2px solid rgba(14, 165, 233, 0.3)',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
              />
            </div>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                color: '#fff',
                fontWeight: 800,
                letterSpacing: 3,
                fontSize: 26,
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TURBO TAXI
            </Typography.Title>
            <Typography.Text
              style={{
                fontSize: 13,
                color: 'rgba(148, 163, 184, 0.8)',
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Панель администратора
            </Typography.Text>
          </div>

          {/* Form */}
          <Form
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Введите логин' }]}
              style={{ marginBottom: 20 }}
              className="login-input"
            >
              <Input
                prefix={
                  <UserOutlined
                    style={{ color: 'rgba(14, 165, 233, 0.7)', fontSize: 18, marginRight: 8 }}
                  />
                }
                placeholder="Логин"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
              style={{ marginBottom: 28 }}
              className="login-input"
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    style={{ color: 'rgba(14, 165, 233, 0.7)', fontSize: 18, marginRight: 8 }}
                  />
                }
                placeholder="Пароль"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="login-btn"
              >
                Войти в систему
              </Button>
            </Form.Item>
          </Form>

          {/* Security badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 32,
              padding: '12px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <SafetyCertificateOutlined
              style={{ color: 'rgba(14, 165, 233, 0.5)', fontSize: 14 }}
            />
            <Typography.Text
              style={{ fontSize: 12, color: 'rgba(148, 163, 184, 0.5)', letterSpacing: 0.5 }}
            >
              Защищённое соединение
            </Typography.Text>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Typography.Text
              style={{ fontSize: 11, color: 'rgba(148, 163, 184, 0.3)' }}
            >
              &copy; 2026 TURBO TAXI. Все права защищены.
            </Typography.Text>
          </div>
        </div>
      </div>
    </>
  );
};
