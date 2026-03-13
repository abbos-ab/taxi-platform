import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Props {
  src?: string | null;
  name?: string;
  size?: number;
}

export const UserAvatar: React.FC<Props> = ({ src, name, size = 32 }) => (
  <Avatar src={src} size={size} icon={!src && <UserOutlined />}>
    {!src && name ? name[0] : null}
  </Avatar>
);
