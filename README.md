# Vault Finance Dashboard

Vault Finance is a frontend-only finance dashboard built with React + TypeScript. The project focuses on clean UI design, interactive behavior, role-based frontend simulation, and thoughtful state management without relying on a backend.

## Demo Links

- Repository: https://github.com/gandharr/Vault-Finance
- Deployment: https://gandharr.github.io/Vault-Finance/

## Screenshots

### Desktop View

![Vault Finance Dashboard - Desktop](public/screenshots/dashboard-desktop.png)

### Mobile View

<div style="display: flex; gap: 30px; justify-content: center; align-items: flex-start; flex-wrap: wrap; margin: 20px 0;">
  <div style="flex: 0 0 280px; text-align: center;">
    <img src="public/screenshots/dashboard-mobile-1.jpeg" alt="Mobile Login Screen" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
    <p style="font-size: 13px; color: #666; margin-top: 8px;">Login & Access</p>
  </div>
  <div style="flex: 0 0 280px; text-align: center;">
    <img src="public/screenshots/dashboard-mobile-2.jpeg" alt="Mobile Dashboard Screen" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
    <p style="font-size: 13px; color: #666; margin-top: 8px;">Dashboard & Analytics</p>
  </div>
</div>

## Assignment Context

This submission is intentionally designed to match the brief:

- Frontend-only implementation
- Mock/static data support
- Simulated role behavior on UI
- Focus on UX, structure, and interaction quality rather than production backend logic

## Key Features

- Dashboard overview with total balance, income, and expense summary cards
- Time-based balance trend chart with hover point details
- Categorical spending breakdown visualization
- Interactive transaction section with search, filters, sorting, and role-aware actions
- Simulated Viewer/Admin modes with Admin access gate via sign-in modal
- Insights section covering highest spending category, monthly comparison, and observations
- Theme switching (light/dark)
- Workspace settings including demo reset and password reset flow simulation
- Local persistence with localStorage
- Empty-state handling and responsive behavior
- Subtle motion and transition polish
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
