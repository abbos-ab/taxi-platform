import React from 'react';
import { Table, Typography } from 'antd';

const columns = [
  { title: 'Имя', dataIndex: 'full_name', key: 'name' },
  { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
  { title: 'Поездок', dataIndex: 'total_rides', key: 'rides' },
  { title: 'Дата регистрации', dataIndex: 'created_at', key: 'date' },
];

export const PassengersListPage: React.FC = () => {
  return (
    <>
      <Typography.Title level={4}>Пассажиры</Typography.Title>
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </>
  );
};
