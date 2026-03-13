import React from 'react';
import type { FareQuote } from '../../types/ride';

interface TariffSelectorProps {
  quotes: FareQuote[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const tariffIcons: Record<string, string> = {
  'Стандарт': '🚗',
  'Комфорт': '🚙',
  'Бизнес': '🚘',
};

export const TariffSelector: React.FC<TariffSelectorProps> = ({ quotes, selectedId, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      {quotes.map((q) => (
        <button
          key={q.tariff_id}
          onClick={() => onSelect(q.tariff_id)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all
            ${selectedId === q.tariff_id
              ? 'border-accent bg-sky-50'
              : 'border-border bg-white hover:border-gray-300'}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tariffIcons[q.tariff_name] || '🚗'}</span>
            <div className="text-left">
              <p className="font-semibold text-primary">{q.tariff_name}</p>
              <p className="text-sm text-text-secondary">
                {q.distance_km.toFixed(1)} км &middot; ~{Math.round(q.duration_min)} мин
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-primary">{q.price.toFixed(0)} с.</p>
        </button>
      ))}
    </div>
  );
};
