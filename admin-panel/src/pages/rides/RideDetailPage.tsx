import React from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Typography, Spin } from 'antd';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useRideDetail } from '../../api/hooks/useRides';
import { formatDate, formatPrice } from '../../utils/formatters';

export const RideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ride, isLoading } = useRideDetail(id!);

  if (isLoading) return <Spin />;
  if (!ride) return <Typography.Text>Поездка не найдена</Typography.Text>;

  return (
    <Card title={`Поездка ${String(ride.id).slice(0, 8)}`}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Статус"><StatusBadge status={ride.status} /></Descriptions.Item>
        <Descriptions.Item label="Цена">{formatPrice(ride.estimated_price)}</Descriptions.Item>
        <Descriptions.Item label="Откуда">{ride.pickup_address}</Descriptions.Item>
        <Descriptions.Item label="Куда">{ride.dropoff_address}</Descriptions.Item>
        <Descriptions.Item label="Расстояние">{ride.estimated_distance} км</Descriptions.Item>
        <Descriptions.Item label="Время">{ride.estimated_duration} мин</Descriptions.Item>
        <Descriptions.Item label="Создана">{formatDate(ride.created_at)}</Descriptions.Item>
        <Descriptions.Item label="Завершена">{ride.completed_at ? formatDate(ride.completed_at) : '—'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
