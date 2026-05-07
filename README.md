# Vault Finance ✨

Vault Finance is a full-stack personal finance tracker with authentication, transaction management, dashboard analytics, and reporting views.

This repository includes:
- A React + TypeScript frontend (Vite)
- A Node.js + Express + TypeScript backend
- MongoDB Atlas persistence via Mongoose
- GitHub Pages deployment for frontend
- Railway deployment for backend API

## 🚀 Live URLs

- Frontend (GitHub Pages): https://gandharr.github.io/Vault-Finance/
- Backend (Railway): https://vault-finance-production.up.railway.app
- Backend Health Check: https://vault-finance-production.up.railway.app/health

## Table of Contents

1. [Project Highlights](#project-highlights)
2. [Screenshots](#screenshots)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Feature Overview](#feature-overview)
6. [API Endpoints](#api-endpoints)
7. [Local Development Setup](#local-development-setup)
8. [Environment Variables](#environment-variables)
9. [Build and Deployment](#build-and-deployment)
10. [Troubleshooting](#troubleshooting)
11. [Security Notes](#security-notes)
12. [Roadmap Ideas](#roadmap-ideas)
13. [License](#license)

## ✨ Project Highlights

- Full authentication flow: signup, login, current user lookup, password reset
- Transaction CRUD with income/expense support
- Dashboard statistics:
  - Total income
  - Total expense
  - Current balance
  - Recent transactions
- Category breakdown analytics
- Monthly trend analytics
- No demo fallback data in production flow
- Friendly frontend error messages for backend unavailability

## 📸 Screenshots

### Desktop Dashboard

![Vault Finance Dashboard Desktop](public/screenshots/dashboard-desktop.png)

### Mobile Dashboard (Variant 1)

![Vault Finance Dashboard Mobile 1](public/screenshots/dashboard-mobile-1.jpeg)

### Mobile Dashboard (Variant 2)

![Vault Finance Dashboard Mobile 2](public/screenshots/dashboard-mobile-2.jpeg)

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB Atlas
- dotenv
- cors

### Tooling

- ESLint
- GitHub Actions (Pages deployment)
- Railway (backend hosting)

## 🔧 Feature Overview

### 1. Authentication

Backend routes under `/api/auth`:
- `POST /login`
- `POST /signup`
- `GET /current?email=...`
- `POST /reset-password`

Frontend stores the active user email in local storage under key `vault-current-email`.

### 2. Transactions

Backend routes under `/api/transactions`:
- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`
- `GET /type/:type`

### 3. Dashboard Analytics

Backend routes under `/api/dashboard`:
- `GET /stats`
- `GET /category-breakdown/:type`
- `GET /monthly-trend`

### 4. Health Monitoring

- `GET /health` returns:

```json
{ "status": "ok" }
```

## 🧩 API Endpoints

Base URL (production):

```text
https://vault-finance-production.up.railway.app
```

### Auth

- `POST /api/auth/login`
  - Body: `{ "email": "string", "password": "string" }`
- `POST /api/auth/signup`
  - Body: `{ "email": "string", "fullName": "string", "password": "string" }`
- `GET /api/auth/current?email=user@example.com`
- `POST /api/auth/reset-password`
  - Body: `{ "email": "string", "newPassword": "string" }`

### Transactions

- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions`
  - Body:

```json
{
  "date": "2026-05-08",
  "amount": 1200,
  "category": "Salary",
  "type": "income",
  "merchant": "Employer",
  "note": "Monthly salary"
}
```

- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/type/income`
- `GET /api/transactions/type/expense`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/category-breakdown/income`
- `GET /api/dashboard/category-breakdown/expense`
- `GET /api/dashboard/monthly-trend`

## 📁 Repository Structure

```text
Vault-Finance/
  .github/workflows/
    deploy.yml
  backend/
    src/
      db.ts
      models.ts
      mongodb.ts
      server.ts
      types.ts
      routes/
        auth.ts
        dashboard.ts
        transactions.ts
  public/
    screenshots/
      dashboard-desktop.png
      dashboard-mobile-1.jpeg
      dashboard-mobile-2.jpeg
  src/
    components/
    pages/
    services/
    types/
    App.tsx
    config.ts
  package.json
  README.md
```

## 🚀 Local Development Setup

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas cluster (or local MongoDB)

### 1. Clone

```bash
git clone https://github.com/gandharr/Vault-Finance.git
cd Vault-Finance
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Backend Environment

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

### 5. Run Backend

```bash
cd backend
npm run dev
```

### 6. Run Frontend

```bash
npm run dev
```

Frontend default: `http://localhost:5173`

## 🔑 Environment Variables

### Frontend

- `VITE_API_URL` (required in production build)
  - Example:

```env
VITE_API_URL=https://vault-finance-production.up.railway.app
```

- `VITE_API_URLS` (optional, comma-separated fallback URLs)

### Backend

- `MONGODB_URI` (required)
- `PORT` (optional, Railway provides `PORT` automatically)

## 🚢 Build and Deployment

### Frontend Build

```bash
npm run build
```

### Backend Build

```bash
cd backend
npm run build
```

### GitHub Pages Deployment

Frontend deploy is handled by `.github/workflows/deploy.yml` on push to `main`.

Key workflow env:

```yaml
env:
  VITE_API_URL: https://vault-finance-production.up.railway.app
```

### Railway Deployment

Backend is deployed from `backend/` with scripts:

- Build: `npm install && npm run build`
- Start: `npm start`

## 🧪 Troubleshooting

### 1. Frontend shows "Backend is unavailable"

Check:
- Backend health URL is live
- Frontend bundle uses latest `VITE_API_URL`
- Browser cache is cleared (`Ctrl+F5`)

### 2. CORS / Network Error in browser

Usually indicates frontend is calling wrong domain or dead endpoint.

Fix:
- Verify `VITE_API_URL` in workflow
- Trigger GitHub Pages redeploy
- Use cache-busted URL for testing: `?v=2`

### 3. MongoDB connection error on Railway

Symptoms:
- `MongooseServerSelectionError`

Fix:
- Confirm `MONGODB_URI` in Railway Variables
- Ensure Atlas Network Access allows Railway (temporary: `0.0.0.0/0`)

### 4. TypeScript build errors with Node16 module resolution

If using `moduleResolution: node16`, relative imports must include `.js` extension in TS source for runtime ESM output.

## 🔒 Security Notes

- Do not commit secrets in repository.
- Keep `MONGODB_URI` in Railway variables or local `.env` only.
- For production, tighten Atlas IP access and use least privilege users.
- Current auth is basic email/password check; for production-grade auth, migrate to hashed passwords and JWT/session tokens.

## 🗺️ Roadmap Ideas

- Password hashing with `bcrypt`
- JWT-based auth and route protection
- Role-based authorization
- Pagination and filtering for transactions
- Export reports to CSV/PDF
- Unit and integration tests
- CI checks for backend and frontend builds

## 📜 License

This project is licensed under the terms in [LICENSE](LICENSE).
