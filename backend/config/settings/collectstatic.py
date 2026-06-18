"""
Settings used only for `manage.py collectstatic`.

django-cloudinary-storage replaces Django's collectstatic command and reads the
deprecated STATICFILES_STORAGE setting, which conflicts with Django 5+ STORAGES.

Static assets are collected to the local filesystem and served by WhiteNoise —
not Cloudinary. Media uploads still use Cloudinary at runtime via production
settings and STORAGES['default'].
"""

from .production import *  # noqa: F401, F403

INSTALLED_APPS = [
    app for app in INSTALLED_APPS if app not in ('cloudinary_storage', 'cloudinary')
]
