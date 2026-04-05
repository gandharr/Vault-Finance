import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'

type TransactionType = 'income' | 'expense'
type Role = 'viewer' | 'admin'
type Theme = 'light' | 'dark'
type SortMode = 'newest' | 'oldest' | 'amount-high' | 'amount-low'
type AuthMode = 'login' | 'signup' | 'reset'

type Transaction = {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  merchant: string
  note: string
}

type TransactionDraft = Omit<Transaction, 'id'>
type AuthDraft = {
  fullName: string
  email: string
  password: string
}

const storageKey = 'zorvyn-finance-dashboard-v1'
const openingBalance = 12840

const sampleTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2026-04-03',
    amount: 5200,
    category: 'Salary',
    type: 'income',
    merchant: 'Northstar Studio',
    note: 'Monthly design stipend',
  },
  {
    id: 'tx-002',
    date: '2026-04-02',
    amount: 1240,
    category: 'Housing',
    type: 'expense',
    merchant: 'Orchard Residence',
    note: 'Apartment rent',
  },
  {
    id: 'tx-003',
    date: '2026-04-01',
    amount: 320,
    category: 'Groceries',
    type: 'expense',
    merchant: 'Fresh Mart',
    note: 'Weekly essentials',
  },
  {
    id: 'tx-004',
    date: '2026-03-28',
    amount: 180,
    category: 'Transport',
    type: 'expense',
    merchant: 'Metro Line',
    note: 'Commute and rides',
  },
  {
    id: 'tx-005',
    date: '2026-03-26',
    amount: 620,
    category: 'Freelance',
    type: 'income',
    merchant: 'Pixel Harbor',
    note: 'Brand refresh milestone',
  },
  {
    id: 'tx-006',
    date: '2026-03-22',
    amount: 210,
    category: 'Subscriptions',
    type: 'expense',
    merchant: 'Figma',
    note: 'Team collaboration tools',
  },
  {
    id: 'tx-007',
    date: '2026-03-14',
    amount: 145,
    category: 'Dining',
    type: 'expense',
    merchant: 'Mosaic Kitchen',
    note: 'Client lunch',
  },
  {
    id: 'tx-008',
    date: '2026-02-27',
    amount: 5100,
    category: 'Salary',
    type: 'income',
    merchant: 'Northstar Studio',
    note: 'Monthly design stipend',
  },
  {
    id: 'tx-009',
    date: '2026-02-21',
    amount: 890,
    category: 'Education',
    type: 'expense',
    merchant: 'Coursera',
    note: 'Frontend specialization',
  },
  {
    id: 'tx-010',
    date: '2026-02-18',
    amount: 265,
    category: 'Utilities',
    type: 'expense',
    merchant: 'City Electric',
    note: 'Monthly utility bill',
  },
  {
    id: 'tx-011',
    date: '2026-01-29',
    amount: 470,
    category: 'Freelance',
    type: 'income',
    merchant: 'Studio Arc',
    note: 'Landing page redesign',
  },
  {
    id: 'tx-012',
    date: '2026-01-25',
    amount: 315,
    category: 'Health',
    type: 'expense',
    merchant: 'Wellness Clinic',
    note: 'Annual check-up',
  },
]

const emptyDraft: TransactionDraft = {
  date: '2026-04-04',
  amount: 0,
  category: 'Housing',
  type: 'expense',
  merchant: '',
  note: '',
}

const emptyAuthDraft: AuthDraft = {
  fullName: '',
  email: '',
  password: '',
}

const faviconPath = `${import.meta.env.BASE_URL}favicon.svg`

function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [role, setRole] = useState<Role>(() => {
    const storedRole = getStoredValue<Role>('role', 'viewer')
    const storedName = window.localStorage.getItem('vault-user-name')
    const hasUser = Boolean(storedName && storedName.trim().length > 0)

    return storedRole === 'admin' && !hasUser ? 'viewer' : storedRole
  })
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = window.localStorage.getItem(storageKey)

    if (!stored) {
      return sampleTransactions
    }

    try {
      const parsed = JSON.parse(stored) as Transaction[]
      return parsed.length > 0 ? parsed : sampleTransactions
    } catch {
      return sampleTransactions
    }
  })
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<TransactionDraft>(emptyDraft)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingRole, setPendingRole] = useState<Role | null>(null)
  const [authDraft, setAuthDraft] = useState<AuthDraft>(emptyAuthDraft)
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    const storedName = window.localStorage.getItem('vault-user-name')
    return storedName && storedName.trim().length > 0 ? storedName : null
  })
  const [statusMessage, setStatusMessage] = useState('Sample portfolio ready')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('zorvyn-theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('zorvyn-role', role)
  }, [role])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('vault-user-name', currentUser)
    } else {
      window.localStorage.removeItem('vault-user-name')
    }
  }, [currentUser])

  const categoryOptions = useMemo(() => {
    const options = new Set(transactions.map((transaction) => transaction.category))
    return ['all', ...Array.from(options).sort((a, b) => a.localeCompare(b))]
  }, [transactions])

  const incomeTotal = useMemo(() => sumBy(transactions, 'income'), [transactions])
  const expenseTotal = useMemo(() => sumBy(transactions, 'expense'), [transactions])
  const totalBalance = openingBalance + incomeTotal - expenseTotal

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const visible = transactions.filter((transaction) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [transaction.merchant, transaction.category, transaction.note]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesCategory =
        categoryFilter === 'all' || transaction.category === categoryFilter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter

      return matchesQuery && matchesCategory && matchesType
    })

    return visible.slice().sort((left, right) => {
      switch (sortMode) {
        case 'amount-high':
          return right.amount - left.amount
        case 'amount-low':
          return left.amount - right.amount
        case 'oldest':
          return new Date(left.date).getTime() - new Date(right.date).getTime()
        case 'newest':
        default:
          return new Date(right.date).getTime() - new Date(left.date).getTime()
      }
    })
  }, [categoryFilter, query, sortMode, transactions, typeFilter])

  const trendData = useMemo(() => buildTrend(transactions), [transactions])
  const spendingBreakdown = useMemo(() => buildBreakdown(transactions), [transactions])
  const monthComparison = useMemo(() => buildMonthComparison(transactions), [transactions])
  const insights = useMemo(
    () => buildInsights(transactions, spendingBreakdown, monthComparison),
    [transactions, spendingBreakdown, monthComparison],
  )

  const balanceSeries = trendData.map((entry) => entry.balance)
  const linePoints = buildLinePoints(balanceSeries)
  const sparklineDelta = monthComparison.currentNet - monthComparison.previousNet
  const currentTrendPoint = trendData.at(-1) ?? null
  const previousTrendPoint = trendData.at(-2) ?? null
  const currentMonthIncome = currentTrendPoint?.income ?? 0
  const currentMonthExpense = currentTrendPoint?.expense ?? 0
  const monthFlowMax = Math.max(currentMonthIncome, currentMonthExpense, 1)
  const currentIncomeWidth = Math.round((currentMonthIncome / monthFlowMax) * 100)
  const currentExpenseWidth = Math.round((currentMonthExpense / monthFlowMax) * 100)
  const monthComparisonDelta = monthComparison.currentNet - monthComparison.previousNet
  const currentMonthLabel = trendData.at(-1)?.label ?? 'Current'
  const previousMonthLabel = trendData.at(-2)?.label ?? 'Previous'
  const trendCheckpointCount = trendData.length
  const monthComparisonDeltaMultiple =
    monthComparison.previousNet === 0
      ? null
      : (Math.abs(monthComparison.currentNet) / Math.abs(monthComparison.previousNet)).toFixed(1)
  const latestTrendPoint = trendData.at(-1) ?? null
  const highestExpensePoint = useMemo(() => {
    if (trendData.length === 0) {
      return null
    }

    return trendData.reduce((highest, entry) => {
      if (entry.expense > highest.expense) {
        return entry
      }

      return highest
    }, trendData[0])
  }, [trendData])
  const positiveChange = monthComparison.currentNet >= monthComparison.previousNet
  const isEditing = editingId !== null
  const canManage = role === 'admin'

  function handleRoleChange(nextRole: Role) {
    if (nextRole === 'viewer') {
      setPendingRole(null)
      setRole('viewer')
      setStatusMessage('Viewer mode enabled: dashboard is read only.')
      setEditingId(null)
      setDraft(emptyDraft)
      return
    }

    setPendingRole('admin')
    openAuth('login')
    setStatusMessage('Sign in to access Admin mode.')
  }

  function handleThemeChange() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  function openAuth(nextMode: AuthMode) {
    setAuthMode(nextMode)
    setAuthOpen(true)
    setAuthDraft(emptyAuthDraft)
  }

  function closeAuth() {
    setAuthOpen(false)
  }

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (authMode === 'reset') {
      if (authDraft.email.trim().length === 0) {
        setStatusMessage('Enter your email to reset your password.')
        return
      }

      setAuthOpen(false)
      setAuthDraft(emptyAuthDraft)
      setStatusMessage(`Password reset link sent to ${authDraft.email.trim()}.`)
      return
    }

    const name =
      authMode === 'signup'
        ? authDraft.fullName.trim()
        : authDraft.email.trim().split('@')[0]

    if (authDraft.email.trim().length === 0 || authDraft.password.trim().length < 4) {
      setStatusMessage('Enter a valid email and a password with at least 4 characters.')
      return
    }

    if (authMode === 'signup' && name.length < 2) {
      setStatusMessage('Enter your full name to complete sign up.')
      return
    }

    const finalName =
      name.length > 0
        ? name
            .split(' ')
            .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
            .join(' ')
        : 'Vault User'

    setCurrentUser(finalName)
    setAuthOpen(false)
    setAuthDraft(emptyAuthDraft)
    if (pendingRole === 'admin') {
      setRole('admin')
      setPendingRole(null)
    }
    setStatusMessage(
      authMode === 'signup'
        ? `Welcome to Vault, ${finalName}.`
        : `Welcome back, ${finalName}.`,
    )
  }

  function handleSignOut() {
    setCurrentUser(null)
    setPendingRole(null)
    setRole('viewer')
    setStatusMessage('Signed out successfully.')
  }

  function handleEdit(transaction: Transaction) {
    setEditingId(transaction.id)
    setDraft({
      date: transaction.date,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      merchant: transaction.merchant,
      note: transaction.note,
    })
    setStatusMessage(`Editing ${transaction.merchant}`)
  }

  function handleDelete(id: string) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    )
    if (editingId === id) {
      setEditingId(null)
      setDraft(emptyDraft)
    }
    setStatusMessage('Transaction removed successfully.')
  }

  function handleResetDemoData() {
    setTransactions(sampleTransactions)
    setEditingId(null)
    setDraft(emptyDraft)
    setStatusMessage('Demo data restored.')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canManage) {
      return
    }

    const normalizedDraft: TransactionDraft = {
      ...draft,
      amount: Number(draft.amount),
      merchant: draft.merchant.trim(),
      note: draft.note.trim(),
      category: draft.category.trim(),
      date: draft.date,
      type: draft.type,
    }

    if (
      normalizedDraft.amount <= 0 ||
      normalizedDraft.merchant.length === 0 ||
      normalizedDraft.category.length === 0 ||
      normalizedDraft.note.length === 0
    ) {
      setStatusMessage('Complete every field with a valid amount before saving.')
      return
    }

    if (editingId) {
      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === editingId
            ? { id: editingId, ...normalizedDraft }
            : transaction,
        ),
      )
      setStatusMessage('Transaction updated.')
    } else {
      setTransactions((currentTransactions) => [
        { id: createId(), ...normalizedDraft },
        ...currentTransactions,
      ])
      setStatusMessage('Transaction added.')
    }

    setEditingId(null)
    setDraft(emptyDraft)
  }

  return (
    <main className="dashboard-shell">
      <header className="app-header">
        <div className="brand-block">
          <h1 className="brand-title">
            <span className="brand-logo" aria-hidden="true">
              <img src={faviconPath} alt="" />
            </span>
            <span>Vault Finance</span>
          </h1>
          <p>Executive overview for cash flow, spending behavior, and transaction control.</p>
        </div>

        <div className="header-controls">
          <div className="header-role-chip" aria-label="Role selector">
            <select
              className="role-select"
              value={role}
              onChange={(event) => handleRoleChange(event.target.value as Role)}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="ghost-button subtle compact-btn"
            type="button"
            aria-expanded={preferencesOpen}
            aria-controls="settings-drawer"
            onClick={() => setPreferencesOpen((current) => !current)}
          >
            Settings
          </button>

          {currentUser ? (
            <div className="auth-badge" aria-label="Current signed in user">
              <span>{currentUser}</span>
              <button className="ghost-button subtle compact-btn" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <button className="ghost-button subtle compact-btn auth-login-btn" type="button" onClick={() => openAuth('login')}>
                Login
              </button>
              <button className="primary-button auth-primary compact-btn" type="button" onClick={() => openAuth('signup')}>
                Sign up
              </button>
            </div>
          )}
        </div>
      </header>

      {authOpen ? (
        <>
          <button
            className="settings-overlay"
            type="button"
            aria-label="Close authentication"
            onClick={closeAuth}
          />
          <aside className="auth-modal" aria-label="Authentication">
            <div className="settings-head">
              <div>
                <span className="eyebrow">Vault access</span>
                <h3>
                  {authMode === 'login'
                    ? 'Login'
                    : authMode === 'signup'
                      ? 'Create account'
                      : 'Reset password'}
                </h3>
                {pendingRole === 'admin' ? (
                  <p className="auth-hint">Admin access requires sign-in.</p>
                ) : null}
              </div>
              <button className="ghost-button subtle" type="button" onClick={closeAuth}>
                Close
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' ? (
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={authDraft.fullName}
                    onChange={(event) =>
                      setAuthDraft((current) => ({ ...current, fullName: event.target.value }))
                    }
                  />
                </label>
              ) : null}

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={authDraft.email}
                  onChange={(event) =>
                    setAuthDraft((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>

              {authMode !== 'reset' ? (
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={authDraft.password}
                    onChange={(event) =>
                      setAuthDraft((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                </label>
              ) : null}

              <button className="primary-button" type="submit">
                {authMode === 'login'
                  ? 'Login to Vault'
                  : authMode === 'signup'
                    ? 'Create Vault account'
                    : 'Send reset link'}
              </button>

              {authMode !== 'reset' ? (
                <>
                  <button
                    className="ghost-button subtle"
                    type="button"
                    onClick={() =>
                      setAuthMode((current) => (current === 'login' ? 'signup' : 'login'))
                    }
                  >
                    {authMode === 'login'
                      ? 'Need an account? Sign up'
                      : 'Already have an account? Login'}
                  </button>
                  {authMode === 'login' ? (
                    <button
                      className="ghost-button subtle"
                      type="button"
                      onClick={() => setAuthMode('reset')}
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </>
              ) : (
                <button
                  className="ghost-button subtle"
                  type="button"
                  onClick={() => setAuthMode('login')}
                >
                  Back to login
                </button>
              )}
            </form>
          </aside>
        </>
      ) : null}

      {preferencesOpen ? (
        <>
          <button
            className="settings-overlay"
            type="button"
            aria-label="Close settings"
            onClick={() => setPreferencesOpen(false)}
          />
          <aside className="settings-drawer" id="settings-drawer" aria-label="Dashboard settings">
            <div className="settings-head">
              <div>
                <span className="eyebrow">Workspace settings</span>
                <h3>Preferences</h3>
              </div>
              <button
                className="ghost-button subtle"
                type="button"
                onClick={() => setPreferencesOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="preference-item">
              <strong>Appearance</strong>
              <p>Switch theme without exposing visual controls in the hero area.</p>
              <button className="ghost-button" type="button" onClick={handleThemeChange}>
                {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              </button>
            </div>

            <div className="preference-item">
              <strong>Demo data reset</strong>
              <p>Restore the starting dataset before presenting the dashboard.</p>
              <button className="ghost-button subtle" type="button" onClick={handleResetDemoData}>
                Restore demo data
              </button>
            </div>

            <div className="preference-item">
              <strong>Password reset</strong>
              <p>Send a password reset link to your registered email.</p>
              <button
                className="ghost-button subtle"
                type="button"
                onClick={() => {
                  setPreferencesOpen(false)
                  openAuth('reset')
                }}
              >
                Reset password
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Financial control center</span>
          <h2>Track balances, spending, and momentum with executive clarity.</h2>
          <p>
            A responsive mock finance experience with role-based actions, local
            persistence, transaction controls, and clear visual summaries.
          </p>
        </div>

        <div className="hero-stat-card">
          <div className="stat-header">
            <span>Net balance</span>
            <strong>{formatCurrency(totalBalance)}</strong>
          </div>
          <p className="muted">
            Starting from {formatCurrency(openingBalance)} with live sample activity.
          </p>

          <div className="mini-metrics">
            <div>
              <span>Income</span>
              <strong className="positive">{formatCurrency(incomeTotal)}</strong>
            </div>
            <div>
              <span>Expenses</span>
              <strong className="negative">{formatCurrency(expenseTotal)}</strong>
            </div>
          </div>

          <div className="sparkline-card" aria-label="Balance trend preview">
            <div className="sparkline-meta">
              <span>Net change vs previous month</span>
              <strong className={sparklineDelta >= 0 ? 'positive' : 'negative'}>
                {sparklineDelta >= 0 ? '+' : '-'} {formatCurrency(Math.abs(sparklineDelta))}
              </strong>
            </div>
            <div className="sparkline-bars" role="img" aria-label="Current month income and expense comparison">
              <div className="sparkline-row">
                <span>Income</span>
                <div className="sparkline-track">
                  <div className="sparkline-fill income" style={{ width: `${currentIncomeWidth}%` }} />
                </div>
                <strong className="positive">{formatCurrency(currentMonthIncome)}</strong>
              </div>
              <div className="sparkline-row">
                <span>Expense</span>
                <div className="sparkline-track">
                  <div className="sparkline-fill expense" style={{ width: `${currentExpenseWidth}%` }} />
                </div>
                <strong className="negative">{formatCurrency(currentMonthExpense)}</strong>
              </div>
            </div>
            <div className="sparkline-caption">
              <span>{currentMonthLabel} in vs out</span>
              <strong>
                Compared with {previousTrendPoint?.label ?? 'previous month'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="summary-grid" aria-label="Financial summary">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          note="Cash available after tracked cash flow"
          accent="accent"
        />
        <SummaryCard
          label="Income"
          value={formatCurrency(incomeTotal)}
          note="Salary and freelance inflows"
          accent="positive"
        />
        <SummaryCard
          label="Expenses"
          value={formatCurrency(expenseTotal)}
          note="Outflow across categories"
          accent="negative"
        />
      </section>

      <section className="analysis-grid">
        <article className="panel chart-panel">
          <div className="panel-heading chart-heading">
            <div className="chart-heading-copy">
              <span className="eyebrow">Time-based visualization</span>
              <h2>Balance trend</h2>
              <p>
                {positiveChange
                  ? 'This line tracks cumulative balance movement over time. Use it to see trajectory and inflection points.'
                  : 'This line tracks cumulative balance movement over time. Recent points indicate a softer trajectory.'}
              </p>
            </div>
            <span className="panel-chip">
              {trendCheckpointCount > 0
                ? `Last ${trendCheckpointCount} month${trendCheckpointCount > 1 ? 's' : ''}`
                : 'No monthly data'}
            </span>
          </div>

          <div className="chart-frame line-chart-frame">
            {trendData.length > 0 ? (
              <>
                <svg viewBox="0 0 1000 320" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Monthly balance trend with hoverable points">
                  <defs>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="var(--accent-strong)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={buildAreaPath(trendData)} fill="url(#trendFill)" />
                  <polyline points={linePoints} />
                  {trendData.map((entry, index) => {
                    const dotPosition = buildTrendDotPosition(trendData, index)
                    const topExpenseLabel = entry.topExpense
                      ? `${entry.topExpense.category} at ${entry.topExpense.merchant} (${formatCurrency(entry.topExpense.amount)})`
                      : 'No expense activity'

                    return (
                      <g key={entry.label}>
                        <circle className="trend-dot" cx={dotPosition.x} cy={dotPosition.y} r="7">
                          <title>
                            {`${entry.label}: ${formatCurrency(entry.balance)} | Income ${formatCurrency(entry.income)} | Expenses ${formatCurrency(entry.expense)} | Top expense ${topExpenseLabel}`}
                          </title>
                        </circle>
                      </g>
                    )
                  })}
                </svg>
                <div className="chart-axis">
                  {trendData.map((entry) => (
                    <span key={entry.label}>{entry.label}</span>
                  ))}
                </div>
                <div className="chart-summary-strip">
                  <div>
                    <span>Latest point</span>
                    <strong>
                      {latestTrendPoint?.label ?? 'N/A'} · {formatCurrency(latestTrendPoint?.balance ?? 0)}
                    </strong>
                  </div>
                  <div>
                    <span>Highest monthly expense</span>
                    <strong>
                      {highestExpensePoint && highestExpensePoint.expense > 0
                        ? `${formatCurrency(highestExpensePoint.expense)} spent in ${highestExpensePoint.label}`
                        : 'No expense activity yet'}
                    </strong>
                  </div>
                </div>
                <div className="month-compare-card" aria-label="Month-over-month net comparison">
                  <span>Month-over-month net change</span>
                  <div className="month-compare-grid">
                    <article>
                      <p>{previousMonthLabel}</p>
                      <strong className={monthComparison.previousNet >= 0 ? 'positive' : 'negative'}>
                        {formatCurrency(monthComparison.previousNet)}
                      </strong>
                    </article>
                    <article>
                      <p>{currentMonthLabel}</p>
                      <strong className={monthComparison.currentNet >= 0 ? 'positive' : 'negative'}>
                        {formatCurrency(monthComparison.currentNet)}
                      </strong>
                    </article>
                  </div>
                  <p className={monthComparisonDelta >= 0 ? 'positive' : 'negative'}>
                    {monthComparisonDelta >= 0 ? 'Up' : 'Down'} by {formatCurrency(Math.abs(monthComparisonDelta))}
                    {monthComparisonDeltaMultiple !== null
                      ? ` (${monthComparisonDeltaMultiple}x vs ${previousMonthLabel})`
                      : ''}
                  </p>
                </div>
              </>
            ) : (
              <EmptyState
                title="No trend data available"
                description="Add transactions to generate balance movement over time."
              />
            )}
          </div>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Categorical visualization</span>
              <h2>Spending breakdown</h2>
            </div>
            <span className="panel-chip">Expenses only</span>
          </div>

          <div className="chart-frame breakdown-frame">
            {spendingBreakdown.length > 0 ? (
              spendingBreakdown.map((item) => (
                <div className="breakdown-row" key={item.category}>
                  <div className="breakdown-meta">
                    <strong>{item.category}</strong>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.share}%` }} />
                  </div>
                  <span className="breakdown-share">{item.share}%</span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No expenses to classify"
                description="Switch filters or add an expense transaction to view category split."
              />
            )}
          </div>
        </article>
      </section>

      <section className="insight-grid">
        <article className="panel insight-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Insights</span>
              <h2>What stands out</h2>
            </div>
            <span className={`trend-pill ${positiveChange ? 'up' : 'down'}`}>
              {positiveChange ? 'Improving' : 'Softening'} month over month
            </span>
          </div>

          <div className="insight-stack">
            <InsightRow
              label="Highest spending category"
              value={insights.highestCategory}
              note={insights.highestCategoryNote}
            />
            <InsightRow
              label="Month-over-month net change"
              value={`${currentMonthLabel}: ${formatCurrency(monthComparison.currentNet)} vs ${previousMonthLabel}: ${formatCurrency(monthComparison.previousNet).replace('-', '- ')}`}
              note={monthComparison.summary}
            />
            <InsightRow
              label="Observation"
              value={insights.observation}
              note="Combines balance movement and expense concentration."
            />
          </div>
        </article>

        <article className="panel admin-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Role-based UI</span>
              <h2>{canManage ? 'Admin tools' : 'Viewer mode'}</h2>
            </div>
          </div>

          {canManage ? (
            <form className="transaction-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        date: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Amount</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={draft.amount === 0 ? '' : draft.amount.toLocaleString('en-IN')}
                    onChange={(event) => {
                      const val = event.target.value.replace(/,/g, '').trim() ? 
                        parseInt(event.target.value.replace(/,/g, ''), 10) : 0
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        amount: Math.max(0, val),
                      }))
                    }}
                  />
                </label>
                <label>
                  <span>Category</span>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        category: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Type</span>
                  <select
                    value={draft.type}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        type: event.target.value as TransactionType,
                      }))
                    }
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Merchant</span>
                <input
                  type="text"
                  value={draft.merchant}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      merchant: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                <span>Note</span>
                <textarea
                  rows={3}
                  value={draft.note}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      note: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  {isEditing ? 'Update transaction' : 'Add transaction'}
                </button>
                {isEditing ? (
                  <button
                    className="ghost-button subtle"
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setDraft(emptyDraft)
                    }}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
          ) : (
            <div className="viewer-card">
              <p>
                Viewer mode is locked to read-only access. Switch to Admin to add,
                edit, or delete transactions.
              </p>
              <div className="viewer-note">No write actions are exposed in this state.</div>
            </div>
          )}
        </article>
      </section>

      <section className="panel transactions-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Transactions</span>
            <h2>History and filters</h2>
          </div>
          <span className="panel-chip">{filteredTransactions.length} visible</span>
        </div>

        <div className="transaction-toolbar">
          <label className="search-field">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search merchant, category, or note"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="filter-select">
            <span>Type</span>
            <div className="filter-select-wrap">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as 'all' | TransactionType)}
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </label>
          <label className="filter-select">
            <span>Category</span>
            <div className="filter-select-wrap">
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                {categoryOptions.map((option) => (
                  <option value={option} key={option}>
                    {option === 'all' ? 'All categories' : option}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="filter-select">
            <span>Sort</span>
            <div className="filter-select-wrap">
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount-high">Amount high to low</option>
                <option value="amount-low">Amount low to high</option>
              </select>
            </div>
          </label>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="transaction-list" role="list">
            {filteredTransactions.map((transaction) => (
              <article className="transaction-row" role="listitem" key={transaction.id}>
                <div className="transaction-identity">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === 'income' ? '↗' : '↘'}
                  </div>
                  <div>
                    <strong>{transaction.merchant}</strong>
                    <span>
                      {formatDate(transaction.date)} · {transaction.category}
                    </span>
                  </div>
                </div>

                <div className="transaction-meta">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span className={`type-pill ${transaction.type}`}>
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>

                <p className="transaction-note">{transaction.note}</p>

                {canManage ? (
                  <div className="row-actions">
                    <button type="button" onClick={() => handleEdit(transaction)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(transaction.id)}>
                      Delete
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transactions match the current filters"
            description="Clear the search or adjust the filters to reveal more rows."
          />
        )}
      </section>

      <footer className="footer-note">
        <span className="footer-status">{statusMessage}</span>
        <span className="footer-credit">© 2026 Gandhar Dhore. All rights reserved.</span>
      </footer>
    </main>
  )
}

function SummaryCard({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note: string
  accent: 'accent' | 'positive' | 'negative'
}) {
  return (
    <article className={`summary-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  )
}

function InsightRow({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="insight-row">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

function getInitialTheme(): Theme {
  const savedTheme = window.localStorage.getItem('zorvyn-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredValue<T extends string>(key: string, fallback: T): T {
  const savedValue = window.localStorage.getItem(`zorvyn-${key}`)
  return savedValue === 'viewer' || savedValue === 'admin' ? (savedValue as T) : fallback
}

function createId() {
  return `tx-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

function sumBy(transactions: Transaction[], type: TransactionType) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)
}

function buildTrend(transactions: Transaction[]) {
  const entries = new Map<
    string,
    {
      income: number
      expense: number
      topExpense: { merchant: string; category: string; amount: number } | null
    }
  >()

  transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7)
    const existing = entries.get(month) ?? { income: 0, expense: 0, topExpense: null }

    if (transaction.type === 'income') {
      existing.income += transaction.amount
    } else {
      existing.expense += transaction.amount
      if (!existing.topExpense || transaction.amount > existing.topExpense.amount) {
        existing.topExpense = {
          merchant: transaction.merchant,
          category: transaction.category,
          amount: transaction.amount,
        }
      }
    }

    entries.set(month, existing)
  })

  let runningBalance = openingBalance
  return Array.from(entries.entries())
    .sort(([leftMonth], [rightMonth]) => leftMonth.localeCompare(rightMonth))
    .map(([month, totals]) => {
      runningBalance += totals.income - totals.expense

      return {
        label: monthToLabel(month),
        balance: runningBalance,
        income: totals.income,
        expense: totals.expense,
        topExpense: totals.topExpense,
      }
    })
}

function buildBreakdown(transactions: Transaction[]) {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const totals = new Map<string, number>()

  expenses.forEach((transaction) => {
    totals.set(
      transaction.category,
      (totals.get(transaction.category) ?? 0) + transaction.amount,
    )
  })

  const grandTotal = Array.from(totals.values()).reduce((total, amount) => total + amount, 0)

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      share: grandTotal === 0 ? 0 : Math.round((amount / grandTotal) * 100),
    }))
    .sort((left, right) => right.amount - left.amount)
}

function buildMonthComparison(transactions: Transaction[]) {
  const monthlyTotals = new Map<string, number>()

  transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7)
    const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount
    monthlyTotals.set(month, (monthlyTotals.get(month) ?? 0) + delta)
  })

  const orderedMonths = Array.from(monthlyTotals.keys()).sort()
  const currentMonth = orderedMonths.at(-1) ?? ''
  const previousMonth = orderedMonths.at(-2) ?? ''
  const currentNet = monthlyTotals.get(currentMonth) ?? 0
  const previousNet = monthlyTotals.get(previousMonth) ?? 0
  const delta = currentNet - previousNet

  return {
    currentNet,
    previousNet,
    summary:
      previousMonth.length > 0
        ? `${monthToLabel(currentMonth)} moved ${delta >= 0 ? 'up' : 'down'} by ${formatCurrency(Math.abs(delta))} from ${monthToLabel(previousMonth)}.`
        : `${monthToLabel(currentMonth)} is the latest completed month in the demo set.`,
  }
}

function buildInsights(
  transactions: Transaction[],
  spendingBreakdown: { category: string; amount: number; share: number }[],
  monthComparison: { currentNet: number; previousNet: number; summary: string },
) {
  const highestCategory = spendingBreakdown[0]?.category ?? 'No expenses yet'
  const highestCategoryNote =
    spendingBreakdown[0] && spendingBreakdown.length > 0
      ? `${formatCurrency(spendingBreakdown[0].amount)} of expense activity is concentrated here.`
      : 'Add an expense to generate category insight.'

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const concentratedShare = spendingBreakdown[0]?.share ?? 0

  let observation = 'Track more transactions to surface a clearer operating pattern.'

  if (transactions.length > 0) {
    if (monthComparison.currentNet >= monthComparison.previousNet) {
      observation = `Net cash flow improved this month. ${highestCategory} represents ${concentratedShare}% of tracked spending.`
    } else {
      observation = `Cash flow softened this month. ${highestCategory} remains the largest spending category.`
    }

    if (totalExpenses > 0 && concentratedShare >= 40) {
      observation = `${highestCategory} alone accounts for ${concentratedShare}% of spending, so a small reduction here would have the biggest impact.`
    }
  }

  return {
    highestCategory,
    highestCategoryNote,
    observation,
  }
}

function buildLinePoints(values: number[]) {
  if (values.length === 0) {
    return ''
  }

  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const width = 1000
  const height = 320
  const padding = 28

  return values
    .map((value, index) => {
      const denominator = values.length > 1 ? values.length - 1 : 1
      const x = padding + (index * (width - padding * 2)) / denominator
      const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue)
      const y = height - padding - ratio * (height - padding * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function buildTrendDotPosition(
  trendData: { balance: number }[],
  index: number,
) {
  const values = trendData.map((entry) => entry.balance)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const width = 1000
  const height = 320
  const padding = 28
  const denominator = trendData.length > 1 ? trendData.length - 1 : 1
  const value = values[index] ?? 0
  const x = padding + (index * (width - padding * 2)) / denominator
  const ratio = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue)
  const y = height - padding - ratio * (height - padding * 2)

  return { x: x.toFixed(1), y: y.toFixed(1) }
}

function buildAreaPath(trendData: { balance: number }[]) {
  if (trendData.length === 0) {
    return ''
  }

  const width = 1000
  const height = 320
  const padding = 28
  const values = trendData.map((entry) => entry.balance)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const denominator = trendData.length > 1 ? trendData.length - 1 : 1

  const points = trendData.map((entry, index) => {
    const x = padding + (index * (width - padding * 2)) / denominator
    const ratio = maxValue === minValue ? 0.5 : (entry.balance - minValue) / (maxValue - minValue)
    const y = height - padding - ratio * (height - padding * 2)
    return { x, y }
  })

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]

  return [
    `M ${firstPoint.x.toFixed(1)} ${height - padding}`,
    `L ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)}`,
    ...points.slice(1).map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`),
    `L ${lastPoint.x.toFixed(1)} ${height - padding}`,
    'Z',
  ].join(' ')
}

function monthToLabel(month: string) {
  if (month.length !== 7) {
    return 'Current'
  }

  const [year, monthNumber] = month.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(year, monthNumber - 1, 1))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
export default App
