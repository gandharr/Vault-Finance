# Vault Finance

<p align="center">
  <img src="src/assets/hero.png" alt="Vault Finance hero" width="980" />
</p>

<p align="center">
  <strong>A polished full-stack personal finance dashboard with a clean interface, live analytics, and a production backend.</strong>
</p>

<p align="center">
  <a href="https://gandharr.github.io/Vault-Finance/">Live Demo</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#features">Features</a> •
  <a href="#api-endpoints">API</a>
</p>

Vault Finance helps you track money with a minimal, premium-feeling dashboard. It includes authentication, transaction management, analytics cards, trend charts, and a reports view, all backed by MongoDB Atlas and deployed with GitHub Pages + Railway.

## Live Links

| Area | URL |
| --- | --- |
| Frontend | https://gandharr.github.io/Vault-Finance/ |
| Backend | https://vault-finance-production.up.railway.app |
| Health Check | https://vault-finance-production.up.railway.app/health |

## What Makes It Stand Out

- Elegant, responsive dashboard UI with soft gradients and card-based layout
- Login/signup flow with persistent current-user state
- Real transaction storage in MongoDB Atlas
- Income vs expense tracking with totals and balance calculation
- Monthly trend chart and expense breakdown visualization
- Clean handling for backend downtime, validation, and missing data
- No demo fallback in the user-facing experience

## Screenshots

| Desktop | Mobile 1 | Mobile 2 |
| --- | --- | --- |
| ![Desktop dashboard](public/screenshots/dashboard-desktop.png) | ![Mobile dashboard 1](public/screenshots/dashboard-mobile-1.jpeg) | ![Mobile dashboard 2](public/screenshots/dashboard-mobile-2.jpeg) |

## Tech Stack

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

### Deployment and Tooling

- GitHub Actions for Pages deployment
- Railway for backend hosting
- ESLint for code quality

## Features

### Authentication

- Signup
- Login
- Current user lookup
- Password reset
- Local persistence of the current user email

### Transactions

- Create income and expense entries
- View all transactions
- Update existing entries
- Delete transactions
- Filter by income or expense type

### Dashboard Analytics

- Current balance
- Total income
- Total expenses
- Transaction count
- Monthly trend chart
- Expense breakdown chart

### Reports View

- Central place for analytics-focused summaries
- Designed to keep financial reporting readable on desktop and mobile

## API Endpoints

Base URL:

```text
https://vault-finance-production.up.railway.app
```

### Health

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

### Auth

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/current?email=user@example.com`
- `POST /api/auth/reset-password`

### Transactions

- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/type/:type`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/category-breakdown/:type`
- `GET /api/dashboard/monthly-trend`

## Repository Structure

```text
Vault-Finance/
  .github/workflows/deploy.yml
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
  README.md
```

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas or local MongoDB instance

### Clone

```bash
git clone https://github.com/gandharr/Vault-Finance.git
cd Vault-Finance
```

### Install Dependencies

```bash
npm install
cd backend
npm install
cd ..
```

### Backend Environment

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

### Run Locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
npm run dev
```

Frontend dev server usually runs at `http://localhost:5173`.

## Environment Variables

### Frontend

```env
VITE_API_URL=https://vault-finance-production.up.railway.app
```

Optional:

```env
VITE_API_URLS=https://vault-finance-production.up.railway.app
```

### Backend

- `MONGODB_URI` - required
- `PORT` - optional for Railway/local overrides

## Build and Deploy

### Frontend Build

```bash
npm run build
```

### Backend Build

```bash
cd backend
npm run build
```

### GitHub Pages

The frontend is deployed automatically from `.github/workflows/deploy.yml` on pushes to `main`.

### Railway

The backend is deployed from the `backend/` directory with:

- Build: `npm install && npm run build`
- Start: `npm start`

## Troubleshooting

### Backend unavailable message

Check:
- Railway service is running
- `MONGODB_URI` is set correctly
- Browser cache is cleared
- GitHub Pages has rebuilt after config changes

### CORS or network error

Usually means the frontend is still pointing to an old API URL. Hard refresh the browser and confirm the deployed workflow uses the production Railway domain.

### MongoDB connection errors

If Railway cannot connect:
- Verify Atlas Network Access
- Confirm the cluster user and password
- Temporarily allow `0.0.0.0/0` while testing

### TypeScript module resolution issues

If using Node16 module resolution, relative imports in ESM output need `.js` extensions in the source files.

## Security Notes

- Never commit secrets into the repo.
- Keep production credentials in Railway variables and local `.env` files.
- Use least-privilege database users in MongoDB Atlas.
- For a production-ready auth system, replace plain password checks with hashing and signed sessions or JWTs.

## Roadmap Ideas

- Password hashing with `bcrypt`
- JWT/session-based authentication
- Better filtering and search for transactions
- CSV and PDF export
- Pagination for large histories
- Automated tests and CI checks

## License

See [LICENSE](LICENSE) for details.
