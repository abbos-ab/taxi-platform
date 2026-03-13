import React from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Typography, Spin, Tag, Button } from 'antd';
import { useDriverDetail } from '../../api/hooks/useDrivers';

export const DriverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: driver, isLoading } = useDriverDetail(id!);

  if (isLoading) return <Spin />;
  if (!driver) return <Typography.Text>Водитель не найден</Typography.Text>;

  return (
    <Card title={`Водитель: ${driver.full_name}`} extra={
      !driver.is_verified && <Button type="primary">Верифицировать</Button>
    }>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Телефон">{driver.phone}</Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={driver.is_online ? 'green' : 'default'}>{driver.is_online ? 'Онлайн' : 'Офлайн'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Верифицирован">
          <Tag color={driver.is_verified ? 'green' : 'red'}>{driver.is_verified ? 'Да' : 'Нет'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Рейтинг">{driver.rating?.toFixed(1)}</Descriptions.Item>
        <Descriptions.Item label="Всего поездок">{driver.total_rides}</Descriptions.Item>
        <Descriptions.Item label="Номер лицензии">{driver.license_number}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
