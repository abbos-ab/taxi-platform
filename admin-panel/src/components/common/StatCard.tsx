import React from 'react';
import { Card, Statistic } from 'antd';

interface Props {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  color?: string;
}

export const StatCard: React.FC<Props> = ({ title, value, prefix, suffix, color }) => (
  <Card>
    <Statistic title={title} value={value} prefix={prefix} suffix={suffix} valueStyle={color ? { color } : undefined} />
  </Card>
);
