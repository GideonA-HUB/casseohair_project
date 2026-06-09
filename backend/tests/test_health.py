import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_health_check(api_client):
    response = api_client.get('/api/v1/health/')
    assert response.status_code == 200
    assert response.data['status'] == 'healthy'
