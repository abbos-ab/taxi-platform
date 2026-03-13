import React from 'react';
import { Card } from 'antd';

export const LiveMap: React.FC = () => {
  // TODO: Подключить react-leaflet + Socket.IO /tracking
  return (
    <Card title="Live карта водителей" style={{ height: 400 }}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        Карта будет подключена после настройки Leaflet
      </div>
    </Card>
  );
};
