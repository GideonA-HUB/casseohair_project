# CasseoHair

Luxury Hair & Wig E-Commerce Platform — premium wigs and hair extensions with Django REST API and React frontend.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, Zustand, TanStack Query, Framer Motion
- **Backend:** Django, Django REST Framework, PostgreSQL
- **Payments:** Paystack, Flutterwave
- **Email:** Resend
- **Media:** Cloudinary (optional, falls back to local storage)
- **Deployment:** Railway (single project), Docker

## Quick Start (Development)

> **Git Bash (MINGW64)** — use forward slashes and `./venv/Scripts/python` (not PowerShell syntax).

### Backend (Terminal 1)

```bash
cd backend
python -m venv venv
./venv/Scripts/pip install -r requirements/dev.txt
./venv/Scripts/python manage.py makemigrations products orders payments notifications site_config
./venv/Scripts/python manage.py migrate
./venv/Scripts/python manage.py seed_data
./venv/Scripts/python manage.py runserver
```

### Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

### Production build (frontend)

```bash
cd frontend
npm run build
```

- Storefront: http://localhost:5173
- API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/admin/
- API Docs: http://localhost:8000/api/docs/

### Default Admin Credentials (after seed)

- Username: `admin`
- Password: `admin123!`

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Django secret key |
| `PAYSTACK_SECRET_KEY` | Paystack secret |
| `PAYSTACK_PUBLIC_KEY` | Paystack public |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret |
| `RESEND_API_KEY` | Resend email API key |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |

## Commerce Settings

- **Delivery Fee:** ₦4,000 flat rate
- **VAT:** Not applicable
- **Checkout:** Guest only (no customer auth)

## Docker

```bash
docker-compose up --build
```

## Railway Deployment

Single project deployment with PostgreSQL addon:

1. Connect repo to Railway
2. Add PostgreSQL service
3. Set environment variables from `.env.example`
4. Deploy — `railway.toml` configures build and health check

## Project Structure

```
casseohair_project/
├── backend/          # Django API
├── frontend/         # React SPA
├── scripts/          # Entrypoint scripts
├── Dockerfile        # Production build
├── docker-compose.yml
└── railway.toml
```
