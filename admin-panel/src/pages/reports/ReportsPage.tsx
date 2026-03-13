import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { RidesChart } from '../../components/charts/RidesChart';
import { RevenueChart } from '../../components/charts/RevenueChart';

export const ReportsPage: React.FC = () => {
  return (
    <>
      <Typography.Title level={4}>Отчёты</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={12}><RidesChart /></Col>
        <Col span={12}><RevenueChart /></Col>
      </Row>
    </>
  );
};
