import React from 'react';
import { Card } from 'antd';

export const RevenueChart: React.FC = () => {
  return (
    <Card title="Выручка за 7 дней" style={{ height: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
        График выручки
      </div>
    </Card>
  );
};
