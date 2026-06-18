from django.core.management.base import BaseCommand
from django.db.models import Q

from apps.products.legacy_categories import LEGACY_CATEGORY_NAMES, LEGACY_CATEGORY_SLUGS
from apps.products.models import Category


class Command(BaseCommand):
    help = 'Remove legacy seed hair-type categories (Bone Straight, Pixel Curls, etc.)'

    def handle(self, *args, **options):
        legacy_qs = Category.objects.filter(
            Q(slug__in=LEGACY_CATEGORY_SLUGS) | Q(name__in=LEGACY_CATEGORY_NAMES)
        )
        count = legacy_qs.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('No legacy categories to remove.'))
            return

        names = list(legacy_qs.values_list('name', flat=True))
        legacy_qs.delete()
        self.stdout.write(
            self.style.SUCCESS(f'Removed {count} legacy categor{"y" if count == 1 else "ies"}: {", ".join(names)}')
        )
