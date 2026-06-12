#!/bin/sh
set -e

export DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-config.settings.production}"

echo "=== CasseoHair Deploy ==="
echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --verbosity 0

echo "Ensuring media upload directory exists..."
mkdir -p media/products media/categories media/site_assets media/testimonials

echo "Preparing frontend template..."
mkdir -p templates
if [ -f static/frontend/index.html ]; then
  cp static/frontend/index.html templates/index.html
  echo "Frontend ready."
else
  echo "WARNING: static/frontend/index.html not found"
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Running seed data..."
  python manage.py seed_data
fi

PORT="${PORT:-8000}"
echo "Starting server on port ${PORT}..."
exec gunicorn config.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers "${WEB_CONCURRENCY:-3}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
