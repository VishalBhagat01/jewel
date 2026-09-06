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

## Features

JWT-style signed token login, protected routes, jewellery CRUD, customer CRUD, walk-in and multi-item billing, stock-safe transactional sales, invoice detail/printing, searchable sales history, dashboard metrics, category sales, top items and low-stock reports.

## API

Authenticated routes are grouped under `/api/auth`, `/api/inventory`, `/api/customers`, `/api/sales`, and `/api/reports`. Reports include `/dashboard`, `/category-sales`, `/top-items`, and `/low-stock`. Interactive docs: `http://localhost:8000/docs`.
