import React from 'react';
import { Tag } from 'antd';
import { RIDE_STATUS_MAP } from '../../utils/constants';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { color, label } = RIDE_STATUS_MAP[status] || { color: 'default', label: status };
  return <Tag color={color}>{label}</Tag>;
};
