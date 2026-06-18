import pytest
from apps.products.legacy_categories import LEGACY_CATEGORY_SLUGS
from apps.products.models import Category


@pytest.mark.django_db
def test_category_list_featured_filter(api_client):
    Category.objects.create(name='Straight hairs', slug='straight-hairs', is_featured=True, order=0)
    Category.objects.create(name='Bone Straight', slug='bone-straight', is_featured=True, order=1)
    Category.objects.create(name='Hidden', slug='hidden', is_featured=False, order=2)

    response = api_client.get('/api/v1/products/categories/?featured=true')
    assert response.status_code == 200
    names = [item['name'] for item in response.data]
    assert 'Straight hairs' in names
    assert 'Bone Straight' in names
    assert 'Hidden' not in names


@pytest.mark.django_db
def test_cleanup_legacy_categories_command_removes_seed_categories():
    Category.objects.create(name='Straight hairs', slug='straight-hairs', is_featured=True)
    Category.objects.create(name='Bone Straight', slug='bone-straight', is_featured=True)

    from django.core.management import call_command

    call_command('cleanup_legacy_categories')

    remaining_slugs = set(Category.objects.values_list('slug', flat=True))
    assert 'straight-hairs' in remaining_slugs
    assert not remaining_slugs.intersection(LEGACY_CATEGORY_SLUGS)
