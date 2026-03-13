from apps.notifications.models import Notification


class NotificationService:
    @staticmethod
    def create_notification(*, user, type, title, body, data=None):
        """Создать уведомление и отправить push."""
        notification = Notification.objects.create(
            user=user, type=type, title=title, body=body, data=data or {}
        )
        # Отправить push асинхронно
        from apps.notifications.tasks import send_push
        send_push.delay(str(user.id), title, body, data)
        return notification

    @staticmethod
    def notify_new_ride(ride, drivers):
        """Уведомить водителей о новой поездке."""
        for driver_profile in drivers:
            NotificationService.create_notification(
                user=driver_profile.user,
                type=Notification.Type.NEW_RIDE_REQUEST,
                title="Новый заказ",
                body=f"Поездка: {ride.pickup_address} → {ride.dropoff_address}",
                data={"ride_id": str(ride.id)},
            )
