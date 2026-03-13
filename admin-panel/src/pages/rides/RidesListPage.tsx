import React from 'react';
import { Table, Typography, Select, Space } from 'antd';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatPrice } from '../../utils/formatters';
import { useRidesList } from '../../api/hooks/useRides';
import { useNavigate } from 'react-router-dom';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', render: (id: string) => id.slice(0, 8) },
  { title: 'Откуда', dataIndex: 'pickup_address', key: 'pickup' },
  { title: 'Куда', dataIndex: 'dropoff_address', key: 'dropoff' },
  { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <StatusBadge status={s} /> },
  { title: 'Цена', dataIndex: 'estimated_price', key: 'price', render: formatPrice },
  { title: 'Дата', dataIndex: 'created_at', key: 'date', render: formatDate },
];

export const RidesListPage: React.FC = () => {
  const { data, isLoading } = useRidesList();
  const navigate = useNavigate();

  return (
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Поездки</Typography.Title>
      </Space>
      <Table
        columns={columns}
        dataSource={data?.results || []}
        loading={isLoading}
        rowKey="id"
        onRow={(record) => ({ onClick: () => navigate(`/rides/${record.id}`) })}
        pagination={{ total: data?.count }}
      />
    </>
  );
};
