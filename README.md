# Mohit Jewellers Atelier Management

React/Vite management dashboard backed by FastAPI, PostgreSQL and psycopg raw SQL.

## Setup


1. Copy `backend/.env.example` to `backend/.env` and set your Supabase `DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`, and a valid `GOLD_API_KEY` from GoldAPI.io. The dashboard uses this key to show live gold and silver prices in INR per troy ounce. After changing `.env`, restart Uvicorn. After changing `.env`, restart Uvicorn.
2. Run `backend/schema.sql` against PostgreSQL. This creates the demo login:
   `admin` / `admin123`.
3. Optional: run `backend/seed_mock_data.sql` to add safe, repeatable presentation data for inventory, customers, sales, invoices, and reports.
4. Start the API:

```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

5. Start the dashboard:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

The default development API base is `http://localhost:8000/api`. For production, replace the demo administrator password with a securely generated hash before deployment.

## Deploy to Vercel

This repository is configured as a single Vercel project. Import the repository with the project root set to the repository root; do not set `frontend` as the root directory.

Before the first deployment, add these Vercel environment variables for the Production environment:

- `DATABASE_URL`
- `SECRET_KEY`
- `GOLD_API_KEY`
- `FRONTEND_URL` (the deployed Vercel URL, for example `https://your-project.vercel.app`; comma-separated origins are supported)

The frontend uses the same-origin `/api` path, so no `VITE_API_BASE_URL` variable is required. Vercel builds `frontend` and serves `api/index.py` as the FastAPI serverless function. Run `backend/schema.sql` and optionally `backend/seed_mock_data.sql` against the production PostgreSQL database before signing in.

## Features

JWT-style signed token login, protected routes, jewellery CRUD, customer CRUD, walk-in and multi-item billing, stock-safe transactional sales, invoice detail/printing, searchable sales history, dashboard metrics, category sales, top items and low-stock reports.

## API

Authenticated routes are grouped under `/api/auth`, `/api/inventory`, `/api/customers`, `/api/sales`, and `/api/reports`. Reports include `/dashboard`, `/category-sales`, `/top-items`, and `/low-stock`. Interactive docs: `http://localhost:8000/docs`.
