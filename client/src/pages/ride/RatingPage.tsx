import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PriceDisplay } from '../../components/ride/PriceDisplay';
import { useRateRide } from '../../api/hooks/useRides';
import { useRideStore } from '../../store/useRideStore';
import { ru } from '../../i18n/ru';

export const RatingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const rateRide = useRateRide();
  const currentRide = useRideStore((s) => s.currentRide);
  const reset = useRideStore((s) => s.reset);

  const handleSubmit = async () => {
    if (!id || rating === 0) return;
    try {
      await rateRide.mutateAsync({ id, rating, comment: comment || undefined });
      reset();
      navigate('/');
    } catch {
      // TODO: show error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-background p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-primary text-center mb-2">{ru.rating.title}</h2>

        {currentRide?.price && (
          <div className="mb-6">
            <PriceDisplay price={currentRide.price} size="lg" />
          </div>
        )}

        <div className="mb-6">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div className="mb-6">
          <Input
            placeholder={ru.rating.comment}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <Button
          fullWidth
          onClick={handleSubmit}
          loading={rateRide.isPending}
          disabled={rating === 0}
        >
          {ru.rating.submit}
        </Button>
      </div>
    </div>
  );
};
