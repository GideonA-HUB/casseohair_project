from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Create or sync Django admin / dashboard superuser from Railway environment variables.'

    def handle(self, *args, **options):
        User = get_user_model()
        username = getattr(settings, 'ADMIN_USERNAME', '').strip()
        password = getattr(settings, 'ADMIN_PASSWORD', '').strip()
        email = getattr(settings, 'ADMIN_USER_EMAIL', '').strip()

        if not username or not password or not email:
            self.stdout.write(self.style.WARNING(
                'ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_USER_EMAIL must all be set.'
            ))
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_staff': True,
                'is_superuser': True,
            },
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Admin user '{username}' created."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Admin user '{username}' credentials synced."))
