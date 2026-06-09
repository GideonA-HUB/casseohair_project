import pytest
from apps.products.models import Category, Product


@pytest.fixture
def category(db):
    return Category.objects.create(name='Bone Straight', slug='bone-straight')


@pytest.fixture
def product(db, category):
    return Product.objects.create(
        name='Luxury Bone Straight 20"',
        slug='luxury-bone-straight-20',
        category=category,
        description='Premium bone straight hair',
        price=150000,
        stock=10,
        length='20',
        lace_type='hd_lace',
    )


@pytest.mark.django_db
def test_product_list(api_client, product):
    response = api_client.get('/api/v1/products/')
    assert response.status_code == 200
    assert response.data['count'] >= 1


@pytest.mark.django_db
def test_product_detail(api_client, product):
    response = api_client.get(f'/api/v1/products/{product.slug}/')
    assert response.status_code == 200
    assert response.data['name'] == product.name


@pytest.mark.django_db
def test_category_list(api_client, category):
    response = api_client.get('/api/v1/products/categories/')
    assert response.status_code == 200
    assert len(response.data) >= 1
