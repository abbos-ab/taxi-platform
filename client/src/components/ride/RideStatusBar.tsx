import React from 'react';
import type { RideStatus } from '../../types/ride';
import { ru } from '../../i18n/ru';

interface RideStatusBarProps {
  status: RideStatus;
}

const statusColors: Record<RideStatus, string> = {
  searching: 'bg-accent',
  accepted: 'bg-sky-500',
  arrived: 'bg-purple-500',
  in_progress: 'bg-warning',
  completed: 'bg-success',
  cancelled: 'bg-danger',
};

export const RideStatusBar: React.FC<RideStatusBarProps> = ({ status }) => {
  return (
    <div className={`${statusColors[status]} text-white px-4 py-2 rounded-xl text-center font-semibold`}>
      {ru.status[status]}
    </div>
  );
};
