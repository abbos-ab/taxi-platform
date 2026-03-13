import React from 'react';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };

  return (
    <div className="text-center">
      <span className={`${sizes[size]} font-bold text-primary`}>{price.toFixed(0)}</span>
      <span className="text-text-secondary ml-1">сомони</span>
    </div>
  );
};
