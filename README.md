# Vault Finance - Personal Finance Dashboard

A full-stack personal finance management application built with React + TypeScript frontend, Express.js backend, and MongoDB database.

## 🌟 Features

- **Dashboard**: Overview with total balance, income/expense summary, and trend charts
- **Transactions**: Manage income and expense transactions with search, filter, and sort
- **Reports**: Analytics and visualizations of spending patterns
- **Authentication**: Sign up, login, and session management
- **Multi-Currency**: Display amounts in INR (₹)
- **Theme Support**: Light and dark mode toggle
- **Responsive Design**: Works on desktop and mobile devices
- **Production Ready**: MongoDB persistence, Express API, cloud deployment ready

## 🏗️ Tech Stack

### Frontend
- React 19.2.4 with Hooks
- React Router 7.1.0 for navigation
- TypeScript for type safety
- Vite for fast development and building
- Recharts for data visualization
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js + Express 4.18.2
- TypeScript for type-safe backend
- Mongoose 8+ for MongoDB ORM
- CORS for cross-origin requests
- Environment-based configuration

### Database
- MongoDB (local or MongoDB Atlas cloud)
- Mongoose schemas for data validation
- User and Transaction collections

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git for version control

## 🚀 Quick Start

### Option 1: MongoDB Atlas (Recommended - No local installation needed)

1. **Create free MongoDB Atlas account**: https://www.mongodb.com/cloud/atlas
2. **Create cluster, get connection string**
3. **Configure backend .env**:
   ```
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vault-finance?retryWrites=true&w=majority
   ```
4. **Start backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
5. **Start frontend** (new terminal):
   ```bash
   npm install
   npm run dev
   ```

See [MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md) for step-by-step instructions.

### Option 2: Local MongoDB

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed setup instructions.

## 📚 Documentation

- **[MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md)** - Quick MongoDB setup (5 min)
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Complete local development setup
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Detailed MongoDB guide
- **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** - Production deployment guide
- **[backend/README.md](./backend/README.md)** - API documentation

## 🎯 Project Structure

```
Vault-Finance/
├── src/                          # Frontend React app
│   ├── components/               # React components
│   ├── services/                 # API service layer
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── backend/                      # Express API server
│   ├── src/
│   │   ├── mongodb.ts           # MongoDB connection
│   │   ├── models.ts            # Mongoose schemas
│   │   ├── db.ts                # Database operations
│   │   ├── server.ts            # Express app setup
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── routes/              # API endpoints
│   ├── dist/                    # Compiled JavaScript
│   └── package.json
├── public/                       # Static assets
├── MONGODB_QUICKSTART.md        # MongoDB 5-min setup
├── LOCAL_SETUP.md               # Full local setup guide
├── MONGODB_SETUP.md             # MongoDB detailed guide
├── RENDER_DEPLOYMENT.md         # Production deployment
└── render.yaml                  # Render deployment config
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/current` - Get logged-in user
- `POST /api/auth/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/type/:type` - Filter by type

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/category-breakdown/:type` - Category breakdown
- `GET /api/dashboard/monthly-trend` - Monthly trend data

See [backend/README.md](./backend/README.md) for detailed API docs.

## 🧪 Testing the Application

1. **Frontend**: http://localhost:5173/Vault-Finance/
2. **Backend Health**: http://localhost:3001/health
3. **Sign up** with test credentials
4. **Create transactions** in the transactions page
5. **View analytics** in the reports page
6. **Check database** via MongoDB Atlas or mongosh

## 🌐 Deployment

### Deploy to Render (Production)

1. Push to GitHub
2. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
3. Backend deploys to Render with MongoDB Atlas
4. Frontend deployed as static site
5. Environment variables configured in Render dashboard

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001              # Local development
VITE_API_URL=https://vault-finance-api.onrender.com  # Production
```

### Backend (.env)
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault-finance
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vault-finance
```

## 🔒 Security Notes

- Passwords should be hashed with bcrypt (currently plaintext - TODO)
- Implement JWT authentication (currently using email in localStorage - TODO)
- Add input validation and sanitization
- Set up HTTPS for production
- Use secure session cookies

## 🚧 Future Improvements

- [ ] Password hashing with bcrypt
- [ ] JWT token authentication
- [ ] User profile and settings page
- [ ] Transaction edit/create forms
- [ ] Budget alerts and notifications
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Advanced reporting and exports

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support & Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB is running (local or Atlas)
- For Atlas: whitelist your IP or use 0.0.0.0/0

### Port Already in Use
- Frontend port 5173: `npm run dev -- --port 5174`
- Backend port 3001: Change `PORT` in backend `.env`

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` in frontend `.env`
- Ensure backend is running
- Check browser console for CORS errors

## 📞 Quick Links

- **Source Code**: [GitHub](https://github.com/gandharr/Vault-Finance)
- **MongoDB Documentation**: https://docs.mongodb.com/
- **React Documentation**: https://react.dev
- **Express Documentation**: https://expressjs.com
- **Render Documentation**: https://render.com/docs

## 🎓 Learning Resources

This project demonstrates:
- Full-stack development with modern tools
- React patterns and hooks
- TypeScript for type safety
- REST API design
- MongoDB database design
- Production deployment
- Environment-based configuration
- Service layer abstraction

---

**Last Updated**: 2024
**Version**: 1.0.0 (MongoDB Backend)
- Themed dropdown controls aligned with the dashboard surface style

## Tech Stack

- React 19
- TypeScript
- Vite
- Plain CSS (custom system, no UI component library)
- localStorage for persistence

## Project Structure

- src/App.tsx: application UI, state, role logic, transaction operations, chart utilities
- src/App.css: visual system, responsive layout, motion, component-level styling
- src/index.css: theme variables, base styles, typography, global surface/background definitions
- public/: static assets (favicon/icons)
- public/screenshots/: README screenshots for desktop and mobile preview

## Setup and Run

Install dependencies:

```bash
npm install
```

Start local development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview production build locally:

```bash
npm run preview
```

## Deployment (GitHub Pages)

- Live URL: https://gandharr.github.io/Vault-Finance/
- Deployment is automated through GitHub Actions on every push to `main`
- Workflow file: `.github/workflows/deploy-pages.yml`
- Vite base path is configured in `vite.config.ts` as `/Vault-Finance/` for project-site routing

If the site does not update immediately after pushing, check the Actions tab in GitHub and wait a few minutes for the workflow to complete.

## Functional Walkthrough

1. Header and Access
- Role selector allows Viewer/Admin switch for demo purposes
- Admin mode is gated by sign-in interaction
- Sign-up/login modal is frontend simulated and state driven

2. Financial Summary
- Total balance is derived from opening balance + income - expenses
- Income and expense cards display current totals in INR format
- Hero sparkline shows balance movement and month-over-month delta

3. Charts and Insights
- Balance trend chart displays monthly trajectory with hover details
- Spending breakdown chart highlights category-wise expense share
- Insights section summarizes key observations from current dataset

4. Transactions
- View transaction details: date, merchant, category, type, amount, note
- Search by merchant/category/note
- Filter by type and category
- Sort by newest/oldest/amount high/amount low
- Admin can add/edit/delete transactions; Viewer is read-only

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    React App (App.tsx)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State Management (useState, useMemo, useEffect)   │
│  ├── Transactions & Filters                         │
│  ├── User Auth & Role                               │
│  ├── Theme & Settings                               │
│  └── UI State (modals, drawers, selections)         │
│                                                     │
│  Utilities & Helpers                                │
│  ├── Data Formatters (currency, date)              │
│  ├── Chart Builders (trend, breakdown, comparison) │
│  ├── SVG Path Generators                           │
│  └── Auth Handlers (signup, login, password reset) │
│                                                     │
│  Components & UI Sections                           │
│  ├── Header (role selector, auth modal)             │
│  ├── Dashboard (summary cards, charts, insights)   │
│  ├── Transaction Section (CRUD operations)          │
│  └── Search/Filter/Sort Interface                   │
│                                                     │
└─────────────────────────────────────────────────────┘
             ↓
    ┌──────────────────────┐
    │  localStorage API    │
    │  (Data Persistence)  │
    └──────────────────────┘
```

**Data Flow:**
- User Actions → State Update → useMemo Recalculation → UI Re-render → localStorage Sync

## Features Deep Dive

### 1. Dashboard Overview
- **Summary Cards**: Real-time calculation of Total Balance, Income, Expenses
- **Balance Trend Chart**: SVG line chart displaying 12-month trajectory with interactive hover labels
- **Spending Breakdown**: Horizontal bar chart categorizing expenses by type with percentage distribution
- **Hero Header**: Quick-view net change indicator with month-over-month delta

### 2. Dynamic Search & Filtering
- **Search**: Global search across merchant, category, and notes fields
- **Categorical Filters**: Toggle expense/income types; multi-select categories
- **Smart Sorting**: Dynamically sort by newest/oldest dates or amount (high/low)
- **Real-time Updates**: All filters apply instantly with empty-state handling

### 3. Role-Based Access Control (Frontend)
- **Viewer Mode**: Read-only access, no transaction modifications, perfect for data audits
- **Admin Mode**: Full CRUD (Create, Read, Update, Delete) permissions
- **Sign-in Gate**: Admin features locked behind email/password authentication (simulated)
- **Seamless Switching**: Role toggle reflected across entire interface immediately

### 4. Interactive Charts with Hover Details
- **Balance Trend**: Hover over points to see exact date and amount
- **Spending Breakdown**: Tooltips display category name and percentage
- **Sparkline Indicators**: Mini trend indicators on summary cards
- **SVG Rendering**: Crisp graphics at any resolution, no external libraries

### 5. Responsive Mobile Experience
- **Adaptive Layout**: Optimized for 480px, 520px, 720px, 900px, 1024px breakpoints
- **Touch-Friendly**: Larger tap targets, readable font sizes on small screens
- **Mobile-First Auth**: Compact auth modal sized for phones (100% viewport width - margins)
- **Smooth Animations**: Subtle transitions maintain polish on all devices

### 6. Data Persistence
- **localStorage Integration**: Automatic sync on every state change
- **JSON Serialization**: Complex state structures preserved accurately
- **Cross-Session Persistence**: Transactions, preferences, auth state retained across browser reopens
- **Demo Reset**: One-click workspace reset to initial state

## User Journey Scenarios

### Scenario 1: New Viewer User
```
1. Opens app → Viewer mode is default
2. Sees dashboard with sample data (12 sample transactions)
3. Can search transactions by merchant or category
4. Can filter by income/expense type
5. Can sort by date or amount
6. Views charts and insights (read-only)
7. Cannot modify data
8. Can toggle dark/light mode anytime
```

### Scenario 2: Admin User Setup & Transaction Management
```
1. Clicks "Login" button → Auth modal appears
2. Selects "Sign Up" → Creates account with email/password
3. Account saved to localStorage users database
4. Switches role to "Admin" → Unlock panel appears
5. Clicks "Unlock Admin" → Sign-in modal required
6. Enters credentials → Access unlocked
7. Can now: Add new transactions, Edit existing transactions, Delete transactions
8. Changes sync instantly to charts, summaries, and sorting UI
9. Can "Reset Workspace" in Settings to clear all data
```

### Scenario 3: Data Exploration & Analysis
```
1. User applies filters (Show only Expenses, Category: Groceries)
2. Transaction list updates instantly
3. Summary cards recalculate (Income/Expenses/Balance)
4. Charts re-render with filtered dataset
5. Insights update with new highest-category and monthly comparison
6. Search adds additional refinement on top of filters
7. User can sort results by newest/oldest or amount
8. All state persists if page is refreshed
```

## Testing Scenarios (Manual QA Checklist)

### Authentication & Authorization
- [ ] Sign up with new email → Shows account created
- [ ] Login with wrong password → Shows error
- [ ] Login with correct password → Grants Admin access
- [ ] Sign out → Returns to Viewer mode
- [ ] Close browser, reopen → Account data persists
- [ ] Password reset flow → Simulates reset UI

### Dashboard Features
- [ ] Summary cards show correct calculated values
- [ ] Balance trend chart renders 12 months of data
- [ ] Spending breakdown displays all categories proportionally
- [ ] Hero sparkline shows month-over-month change (positive/negative)
- [ ] All numbers format correctly in INR locale (₹ symbol, comma separators)

### Transaction Operations (Admin Only)
- [ ] Add transaction → Appears in list, updates cards/charts
- [ ] Edit transaction → Updates instantly in all UI sections
- [ ] Delete transaction → Removes from list and updates summaries
- [ ] Duplicate prevention → Same merchant/category/date can coexist

### Search, Filter & Sort
- [ ] Search by merchant → Shows matching transactions
- [ ] Search by category → Shows matching transactions
- [ ] Search by note → Shows matching transactions
- [ ] Filter by Expense → Shows only expenses
- [ ] Filter by Income → Shows only income
- [ ] Multi-filter (Expense + Groceries) → Shows only matching subset
- [ ] Sort Newest → Orders by date descending
- [ ] Sort Oldest → Orders by date ascending
- [ ] Sort Amount High → Orders descending by amount
- [ ] Sort Amount Low → Orders ascending by amount
- [ ] Combine filters + search + sort → All apply simultaneously

### Responsive Behavior
- [ ] Desktop (1920px): Full layout displayed
- [ ] Tablet (900px): Sidebar collapses, content adapts
- [ ] Mobile (520px): Auth modal properly centered and sized
- [ ] Mobile (480px): All text readable, buttons accessible
- [ ] Orientation change: Layout adapts smoothly

### Dark Mode
- [ ] Toggle dark mode → Color scheme inverts
- [ ] Stays in dark mode on page refresh
- [ ] Charts visible in both themes
- [ ] Text contrast meets accessibility standards

### Performance & Edge Cases
- [ ] Empty transaction list → Shows "No transactions" state
- [ ] Filtered results empty → Shows "No transactions match filters" state
- [ ] Large dataset (100+ transactions) → Still responsive
- [ ] localStorage quota not exceeded → Data persists

## Requirement-by-Requirement Mapping

1. Dashboard Overview: Implemented
- Summary cards: Total Balance, Income, Expenses
- Time-based visualization: Balance trend chart
- Categorical visualization: Spending breakdown

2. Transactions Section: Implemented
- Transaction fields displayed: Date, Amount, Category, Type, Merchant, Note
- Interactive features: search, filtering, sorting

3. Basic Role-Based UI: Implemented
- Viewer: read-only mode
- Admin: add/edit/delete enabled
- Role switch demonstrated directly in UI

4. Insights Section: Implemented
- Highest spending category insight
- Monthly comparison insight
- Derived observation message

5. State Management: Implemented
- Core state managed via useState
- Derived values optimized with useMemo
- Persistence and side effects handled with useEffect
- Covers: transactions, filters, role, auth modal state, theme, settings state

6. UI/UX Expectations: Implemented
- Clean dashboard layout and consistent typography/spacing
- Responsive behavior across desktop/tablet/mobile
- Empty-state handling for filtered/no-data conditions
- Interaction and transition polish for smoother UX

## Optional Enhancements Included

- Dark mode / light mode toggle
- localStorage persistence
- Authentication flow simulation (login/signup/reset)
- UI transitions and animated entry states
- Additional panel micro-insights and trend metadata

## Design and UX Decisions

- Kept information hierarchy explicit: summary first, trends second, operations after
- Used concise labels and tight spacing to keep content scan-friendly
- Preserved readability in dark surfaces with clear contrast and muted secondary text
- Added progressive interaction polish while respecting reduced-motion preferences
- Matched form controls and dropdowns to the same visual language as the rest of the app

## Data and Logic Notes

- Currency formatting uses INR locale behavior
- Transaction amount input supports comma-formatted numeric entry
- Chart points and summary cards are derived from live in-memory transaction state
- Role behavior is intentionally simulated for frontend evaluation scope

## Assumptions

- Backend/API integration is out-of-scope for this assignment
- Auth is simulated for UI and flow demonstration
- No production security guarantees are claimed in this frontend-only version

## Quick QA Pass (Current Status)

- npm run lint: pass
- npm run build: pass
- Viewer/Admin flow: verified
- Admin add/edit/delete transaction operations: verified
- Search/filter/sort interactions: verified
- Charts render with current dataset and hover labels: verified
- Empty states: verified
- Responsive behavior (desktop/tablet/mobile): verified

## What I Would Do Next in Production

- Replace simulated auth with backend authentication and role authorization
- Move transactions to persistent API/database
- Add automated tests (unit + integration + e2e)
- Add secure validation and error handling across request boundaries
- Add telemetry and monitoring for runtime health
