export const formatPrice = (price: string | number): string =>
  `${Number(price).toFixed(0)} TJS`;

export const formatPhone = (phone: string): string => phone;

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatDistance = (km: number): string =>
  km < 1 ? `${(km * 1000).toFixed(0)} м` : `${km.toFixed(1)} км`;

export const formatDuration = (min: number): string =>
  min < 60 ? `${Math.round(min)} мин` : `${Math.floor(min / 60)} ч ${Math.round(min % 60)} мин`;
