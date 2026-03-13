from celery import shared_task


@shared_task
def send_push(user_id, title, body, data=None):
    """Отправить push-уведомление через FCM."""
    from apps.notifications.models import Device

    devices = Device.objects.filter(user_id=user_id, is_active=True)
    tokens = [d.fcm_token for d in devices]
    if not tokens:
        return

    # TODO: настроить firebase_admin
    # import firebase_admin
    # from firebase_admin import messaging
    # message = messaging.MulticastMessage(
    #     tokens=tokens,
    #     notification=messaging.Notification(title=title, body=body),
    #     data=data or {},
    # )
    # messaging.send_each_for_multicast(message)
