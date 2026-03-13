export const RIDE_STATUS_MAP: Record<string, { color: string; label: string }> = {
  searching: { color: 'blue', label: 'Поиск' },
  accepted: { color: 'cyan', label: 'Принят' },
  arrived: { color: 'purple', label: 'На месте' },
  in_progress: { color: 'orange', label: 'В пути' },
  completed: { color: 'green', label: 'Завершён' },
  cancelled: { color: 'red', label: 'Отменён' },
};
