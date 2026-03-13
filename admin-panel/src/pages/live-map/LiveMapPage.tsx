import React from 'react';
import { Typography } from 'antd';
import { LiveMap } from '../../components/maps/LiveMap';

export const LiveMapPage: React.FC = () => {
  return (
    <>
      <Typography.Title level={4}>Live карта</Typography.Title>
      <LiveMap />
    </>
  );
};
