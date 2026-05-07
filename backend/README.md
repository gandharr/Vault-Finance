# Vault Finance Backend API

## Overview
REST API backend for Vault Finance application built with Express.js and TypeScript.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create new account
- `GET /api/auth/current` - Get current user
- `POST /api/auth/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/type/:type` - Get transactions by type (income/expense)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/category-breakdown/:type` - Get category breakdown
- `GET /api/dashboard/monthly-trend` - Get monthly trend data

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create `.env` file:
```
PORT=3001
NODE_ENV=development
```

### Running Development Server
```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Building
```bash
npm run build
```

### Production
```bash
npm start
```

## Request/Response Examples

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "theme": "light",
  "role": "admin"
}
```

### Create Transaction
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-05-07",
    "amount": 5000,
    "category": "Salary",
    "type": "income",
    "merchant": "Acme Corp"
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:3001/api/dashboard/stats
```

Response:
```json
{
  "totalIncome": 11390,
  "totalExpense": 3565,
  "currentBalance": 20665,
  "transactionCount": 12,
  "recentTransactions": [...]
}
```

## Data Storage

- Uses JSON file-based storage in `data/` directory
- `transactions.json` - All transactions
- `users.json` - User accounts

## Deployment

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for deployment instructions to Render.

## Technologies
- **Framework**: Express.js
- **Language**: TypeScript
- **Runtime**: Node.js
- **Deployment**: Render
