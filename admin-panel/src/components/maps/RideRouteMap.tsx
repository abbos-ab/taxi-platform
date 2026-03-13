import React from 'react';
import { Card } from 'antd';

interface Props {
  pickupAddress?: string;
  dropoffAddress?: string;
}

export const RideRouteMap: React.FC<Props> = ({ pickupAddress, dropoffAddress }) => {
  return (
    <Card title="Маршрут" size="small">
      <p>Откуда: {pickupAddress || '—'}</p>
      <p>Куда: {dropoffAddress || '—'}</p>
    </Card>
  );
};
