from .base import *  # noqa: F401, F403
import os

DEBUG = config('DEBUG', default=False, cast=bool)

# Railway auto-injects RAILWAY_PUBLIC_DOMAIN
RAILWAY_PUBLIC_DOMAIN = os.environ.get('RAILWAY_PUBLIC_DOMAIN', '')
if RAILWAY_PUBLIC_DOMAIN:
    if RAILWAY_PUBLIC_DOMAIN not in ALLOWED_HOSTS:
        ALLOWED_HOSTS = list(ALLOWED_HOSTS) + [RAILWAY_PUBLIC_DOMAIN]
    # Ensure wildcard for all Railway subdomains
    if '.railway.app' not in ALLOWED_HOSTS:
        ALLOWED_HOSTS = list(ALLOWED_HOSTS) + ['.railway.app']

# Trust Railway's reverse proxy for HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

# Railway terminates SSL at the edge. Internal health checks use HTTP.
# SECURE_SSL_REDIRECT=True causes 301 responses and breaks Railway healthchecks.
SECURE_SSL_REDIRECT = False

# CSRF for admin and forms on production domain
_csrf_origins = [o for o in config('CSRF_TRUSTED_ORIGINS', default='', cast=Csv()) if o]
if SITE_URL and SITE_URL not in _csrf_origins:
    _csrf_origins = list(_csrf_origins) + [SITE_URL]
if FRONTEND_URL and FRONTEND_URL not in _csrf_origins:
    _csrf_origins = list(_csrf_origins) + [FRONTEND_URL]
if RAILWAY_PUBLIC_DOMAIN:
    _railway_origin = f'https://{RAILWAY_PUBLIC_DOMAIN}'
    if _railway_origin not in _csrf_origins:
        _csrf_origins.append(_railway_origin)
CSRF_TRUSTED_ORIGINS = _csrf_origins

# Single-project deploy: frontend served from same domain
if not FRONTEND_URL or FRONTEND_URL == 'http://localhost:5173':
    FRONTEND_URL = SITE_URL

# Use simpler static storage in production (avoids manifest issues with SPA assets)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Ensure CORS includes production URL
if SITE_URL and SITE_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS = list(CORS_ALLOWED_ORIGINS) + [SITE_URL]
