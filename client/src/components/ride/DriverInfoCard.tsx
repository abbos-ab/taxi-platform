import React from 'react';
import type { Driver } from '../../types/ride';
import { StarRating } from '../ui/StarRating';

interface DriverInfoCardProps {
  driver: Driver;
}

export const DriverInfoCard: React.FC<DriverInfoCardProps> = ({ driver }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
          {driver.avatar ? (
            <img src={driver.avatar} alt={driver.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            '👤'
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary text-lg">{driver.name}</p>
          <StarRating value={driver.rating} readonly size="sm" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Автомобиль</span>
          <span className="font-medium text-primary">{driver.car.color} {driver.car.model}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-text-secondary">Гос. номер</span>
          <span className="font-bold text-primary tracking-wider">{driver.car.plate}</span>
        </div>
      </div>
    </div>
  );
};
