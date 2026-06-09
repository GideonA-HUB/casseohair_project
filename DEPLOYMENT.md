# CasseoHair — Railway Deployment Guide

Deploy frontend + backend as a **single Railway service** with PostgreSQL.

---

## Architecture

```
Railway Project
├── PostgreSQL (plugin)  →  DATABASE_URL auto-injected
└── Web Service (Docker) →  Django API + React SPA on one domain
```

- Django serves the API at `/api/v1/`
- React build is served at all other routes (SPA)
- Static assets at `/static/frontend/`
- Django Admin at `/admin/`

---

## Step 1 — Push to GitHub

Ensure your repo is on GitHub (already done).

---

## Step 2 — Create Railway Project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your `casseohair_project` repository
4. Railway detects `Dockerfile` and `railway.toml` automatically

---

## Step 3 — Add PostgreSQL

1. In your Railway project → **+ New** → **Database** → **PostgreSQL**
2. Click your **Web Service** → **Variables** → **Add Reference**
3. Reference `DATABASE_URL` from the PostgreSQL service

Railway injects `DATABASE_URL` automatically — do not paste it manually.

---

## Step 4 — Set Environment Variables

In **Web Service → Variables**, add every variable from `.env.example`.

### Required before first deploy

| Variable | Value | Notes |
|----------|-------|-------|
| `SECRET_KEY` | Random 50+ char string | Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | `False` | Never `True` in production |
| `DJANGO_SETTINGS_MODULE` | `config.settings.production` | |
| `ALLOWED_HOSTS` | `.railway.app,casseohairproject-production.up.railway.app` | `.railway.app` matches all Railway subdomains |
| `SITE_URL` | `https://YOUR-APP.up.railway.app` | Update after first deploy |
| `FRONTEND_URL` | Same as `SITE_URL` | Used for payment callbacks |
| `CORS_ALLOWED_ORIGINS` | Same as `SITE_URL` | |
| `CSRF_TRUSTED_ORIGINS` | Same as `SITE_URL` | Required for Django Admin |
| `RUN_SEED` | `true` | **First deploy only** — creates admin + sample data |

### Required for full functionality

| Variable | Service | Purpose |
|----------|---------|---------|
| `PAYSTACK_SECRET_KEY` | Paystack | Payment processing |
| `PAYSTACK_PUBLIC_KEY` | Paystack | Payment processing |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave | Payment processing |
| `FLUTTERWAVE_PUBLIC_KEY` | Flutterwave | Payment processing |
| `FLUTTERWAVE_ENCRYPTION_KEY` | Flutterwave | Payment processing |
| `RESEND_API_KEY` | Resend | Order & contact emails |
| `DEFAULT_FROM_EMAIL` | Resend | Sender address (must be verified domain) |
| `ADMIN_EMAIL` | — | Receives new order notifications |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Product image storage |
| `CLOUDINARY_API_KEY` | Cloudinary | Product image storage |
| `CLOUDINARY_API_SECRET` | Cloudinary | Product image storage |

### Commerce (defaults are fine)

| Variable | Default |
|----------|---------|
| `SITE_NAME` | `CasseoHair` |
| `DELIVERY_FEE` | `4000` |
| `CURRENCY` | `NGN` |

### Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `WEB_CONCURRENCY` | `3` | Gunicorn worker count |
| `RUN_SEED` | — | Set `true` once, then **remove** |

---

## Step 5 — Deploy

1. Railway builds from `Dockerfile` (frontend + backend)
2. On start, the entrypoint:
   - Runs database migrations
   - Collects static files
   - Starts Gunicorn on Railway's `$PORT`
3. Gunicorn starts on Railway's `$PORT` (usually **8080**, not 8000 — this is automatic)

### Variables you do NOT need (delete if present)

| Variable | Why remove |
|----------|------------|
| `JWT_SECRET_KEY` | Not used — JWT auth uses Django `SECRET_KEY` |
| `RATELIMIT_ENABLE` | Not used in this project |

---

## Step 6 — After First Deploy

1. Copy your Railway public URL (e.g. `https://casseohair-production.up.railway.app`)
2. Update these variables with the **exact URL**:
   - `SITE_URL`
   - `FRONTEND_URL`
   - `CORS_ALLOWED_ORIGINS`
   - `CSRF_TRUSTED_ORIGINS`
3. **Remove** `RUN_SEED` or set to `false`
4. Redeploy

### Default admin (created by seed on first deploy)

- **URL:** `https://YOUR-APP.up.railway.app/admin/`
- **Username:** `admin`
- **Password:** `admin123!`

**Change this password immediately after first login.**

---

## Step 7 — Configure Paystack / Flutterwave

Set payment callback URLs in your Paystack/Flutterwave dashboard:

```
https://YOUR-APP.up.railway.app/checkout/verify
```

---

## Step 8 — Configure Resend

1. Verify your sending domain at [resend.com](https://resend.com)
2. Set `DEFAULT_FROM_EMAIL` to an address on that domain (e.g. `orders@yourdomain.com`)

---

## Step 9 — Upload Product Images

1. Go to `https://YOUR-APP.up.railway.app/admin/`
2. Add products with images via Django Admin (uploads go to Cloudinary)
3. Upload logo/favicon via **Site Configuration → Site Assets**

---

## Live URLs After Deploy

| Service | URL |
|---------|-----|
| Storefront | `https://YOUR-APP.up.railway.app/` |
| API | `https://YOUR-APP.up.railway.app/api/v1/` |
| API Docs | `https://YOUR-APP.up.railway.app/api/docs/` |
| Django Admin | `https://YOUR-APP.up.railway.app/admin/` |
| Admin Dashboard | `https://YOUR-APP.up.railway.app/admin-dashboard/login` |
| Health Check | `https://YOUR-APP.up.railway.app/api/v1/health/` |
| Sitemap | `https://YOUR-APP.up.railway.app/sitemap.xml` |

---

## Troubleshooting

### "The train has not arrived at the station"
This means Railway has **no healthy deployment**. Fix the deploy, push again, and wait for **Active** status.

### Healthcheck failed with 301 redirects
Fixed in code: `SECURE_SSL_REDIRECT` is disabled on Railway. Railway terminates HTTPS at the edge; internal checks use HTTP.

### Port 8000 vs 8080
**Do not manually set port 8000** in Railway Settings → Networking. Railway injects `PORT` (often 8080). The app listens on `$PORT` automatically. The "Port 8000" label in the UI is misleading — leave networking on automatic.

### ALLOWED_HOSTS
Your current value is fine:
```
localhost,127.0.0.1,.railway.app
```
You can optionally add your full domain:
```
casseohairproject-production.up.railway.app
```

### Build fails at `npm ci`
Ensure `frontend/package-lock.json` is committed to GitHub.

### 502 / app not starting
Check deploy logs. Common causes:
- `DATABASE_URL` not linked to PostgreSQL service
- `SECRET_KEY` not set

### Static files / blank page
Check logs for collectstatic errors. Redeploy after fixing `SECRET_KEY` and `DJANGO_SETTINGS_MODULE`.

### Django Admin login fails
Ensure `CSRF_TRUSTED_ORIGINS` matches your exact Railway URL (with `https://`).

### Payment redirect fails
Ensure `FRONTEND_URL` matches your live Railway URL exactly.

### Images not uploading
Set all three `CLOUDINARY_*` variables. Without Cloudinary, uploads use ephemeral container storage (lost on redeploy).

---

## Custom Domain (Optional)

1. Railway → Service → **Settings** → **Networking** → **Custom Domain**
2. Update `SITE_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` to your custom domain
3. Update Paystack/Flutterwave callback URLs
