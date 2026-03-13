import React, { useState } from 'react';
import { useRideHistory } from '../../api/hooks/useRides';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ru } from '../../i18n/ru';
import type { RideStatus } from '../../types/ride';

const statusColors: Record<RideStatus, string> = {
  searching: 'bg-blue-100 text-blue-700',
  accepted: 'bg-cyan-100 text-cyan-700',
  arrived: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const HistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRideHistory(page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <LoadingSpinner />
      </div>
    );
  }

  const rides = data?.results || [];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20 sm:pb-4">
      <h1 className="text-2xl font-bold text-primary mb-4">{ru.history.title}</h1>

      {rides.length === 0 ? (
        <div className="text-center text-text-secondary py-12">{ru.history.empty}</div>
      ) : (
        <div className="space-y-3">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">{formatDate(ride.created_at)}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[ride.status]}`}>
                  {ru.status[ride.status]}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="text-sm text-primary">{ride.pickup.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger mt-2 flex-shrink-0" />
                  <span className="text-sm text-primary">{ride.dropoff.address}</span>
                </div>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm text-text-secondary">{ride.tariff}</span>
                <span className="font-semibold text-primary">{formatPrice(ride.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.count > 10 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-accent disabled:text-gray-300"
          >
            &larr; Назад
          </button>
          <span className="text-text-secondary">Стр. {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={rides.length < 10}
            className="text-accent disabled:text-gray-300"
          >
            Далее &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
