import React from 'react';
import { Table, Typography, InputNumber, Switch, Button, Space } from 'antd';

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name' },
  { title: 'Начальная цена (TJS)', dataIndex: 'base_fare', key: 'base_fare' },
  { title: 'За км (TJS)', dataIndex: 'per_km', key: 'per_km' },
  { title: 'За мин (TJS)', dataIndex: 'per_min', key: 'per_min' },
  { title: 'Мин. стоимость (TJS)', dataIndex: 'min_fare', key: 'min_fare' },
  {
    title: 'Активен',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (active: boolean) => <Switch checked={active} />,
  },
];

export const PricingPage: React.FC = () => {
  return (
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Тарифы</Typography.Title>
        <Button type="primary">Добавить тариф</Button>
      </Space>
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </>
  );
};
