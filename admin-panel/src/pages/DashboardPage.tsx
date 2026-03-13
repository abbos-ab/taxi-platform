import React from 'react';
import { Row, Col, Typography } from 'antd';
import { CarOutlined, UserOutlined, RiseOutlined, DollarOutlined } from '@ant-design/icons';
import { StatCard } from '../components/common/StatCard';
import { RidesChart } from '../components/charts/RidesChart';
import { RevenueChart } from '../components/charts/RevenueChart';
import { useDashboardStats } from '../api/hooks/useDashboard';

export const DashboardPage: React.FC = () => {
  const { data: stats } = useDashboardStats();

  return (
    <>
      <Typography.Title level={4}>Дашборд</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatCard title="Активные поездки" value={stats?.active_rides || 0} prefix={<CarOutlined />} color="#1890ff" />
        </Col>
        <Col span={6}>
          <StatCard title="Водителей онлайн" value={stats?.online_drivers || 0} prefix={<UserOutlined />} color="#52c41a" />
        </Col>
        <Col span={6}>
          <StatCard title="Поездок сегодня" value={stats?.today_rides || 0} prefix={<RiseOutlined />} color="#722ed1" />
        </Col>
        <Col span={6}>
          <StatCard title="Выручка сегодня" value={stats?.today_revenue || '0'} prefix={<DollarOutlined />} suffix="TJS" color="#fa8c16" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <RidesChart />
        </Col>
        <Col span={12}>
          <RevenueChart />
        </Col>
      </Row>
    </>
  );
};
