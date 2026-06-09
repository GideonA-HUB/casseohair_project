#!/usr/bin/env bash
# Git Bash / Linux — start Django dev server
cd "$(dirname "$0")/../backend" || exit 1
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate
export DJANGO_SETTINGS_MODULE=config.settings.development
python manage.py runserver
