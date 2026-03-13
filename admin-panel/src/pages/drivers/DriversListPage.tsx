import React from 'react';
import { Table, Typography, Tag, Space, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDriversList } from '../../api/hooks/useDrivers';
import { useNavigate } from 'react-router-dom';

const columns = [
  { title: 'Имя', dataIndex: 'full_name', key: 'name' },
  { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
  {
    title: 'Статус',
    dataIndex: 'is_online',
    key: 'status',
    render: (online: boolean) => (
      <Tag color={online ? 'green' : 'default'}>{online ? 'Онлайн' : 'Офлайн'}</Tag>
    ),
  },
  {
    title: 'Верифицирован',
    dataIndex: 'is_verified',
    key: 'verified',
    render: (v: boolean) => v ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  },
  { title: 'Рейтинг', dataIndex: 'rating', key: 'rating', render: (r: number) => r.toFixed(1) },
  { title: 'Поездок', dataIndex: 'total_rides', key: 'rides' },
];

export const DriversListPage: React.FC = () => {
  const { data, isLoading } = useDriversList();
  const navigate = useNavigate();

  return (
    <>
      <Typography.Title level={4}>Водители</Typography.Title>
      <Table
        columns={columns}
        dataSource={data?.results || []}
        loading={isLoading}
        rowKey="id"
        onRow={(record) => ({ onClick: () => navigate(`/drivers/${record.id}`) })}
      />
    </>
  );
};
