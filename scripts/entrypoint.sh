#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Copying frontend build to templates..."
mkdir -p templates static/frontend
if [ -f static/frontend/index.html ]; then
  cp static/frontend/index.html templates/index.html
fi

echo "Starting server..."
exec "$@"
