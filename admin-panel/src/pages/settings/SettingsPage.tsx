import React from 'react';
import { Typography, Card, Form, Input, Button, message } from 'antd';

export const SettingsPage: React.FC = () => {
  return (
    <>
      <Typography.Title level={4}>Настройки</Typography.Title>
      <Card title="Общие настройки" style={{ maxWidth: 600 }}>
        <Form layout="vertical">
          <Form.Item label="Название компании">
            <Input defaultValue="TURB TAXI" />
          </Form.Item>
          <Form.Item label="Город по умолчанию">
            <Input defaultValue="Худжанд" />
          </Form.Item>
          <Form.Item label="Валюта">
            <Input defaultValue="TJS" disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Сохранить</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
