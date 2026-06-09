#!/usr/bin/env bash
# Full local setup for Git Bash (MINGW64)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Backend setup ==="
cd "$ROOT/backend"
python -m venv venv
./venv/Scripts/pip install -r requirements/dev.txt
./venv/Scripts/python manage.py makemigrations products orders payments notifications site_config
./venv/Scripts/python manage.py migrate
./venv/Scripts/python manage.py seed_data

echo "=== Frontend setup ==="
cd "$ROOT/frontend"
npm install
npm run build

echo "=== Done ==="
echo "Start backend:  cd backend && ./venv/Scripts/python manage.py runserver"
echo "Start frontend: cd frontend && npm run dev"
echo "Admin login:    admin / admin123!"
