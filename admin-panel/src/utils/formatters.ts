import dayjs from 'dayjs';

export const formatDate = (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm');

export const formatPrice = (price: string | number) => `${Number(price).toFixed(0)} TJS`;

export const formatPhone = (phone: string) => phone;
