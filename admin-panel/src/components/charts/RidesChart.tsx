import React from 'react';
import { Card } from 'antd';

export const RidesChart: React.FC = () => {
  // TODO: подключить recharts
  return (
    <Card title="Поездки за 7 дней" style={{ height: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
        График поездок
      </div>
    </Card>
  );
};
