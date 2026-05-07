import axios from 'axios'
import type { Transaction, TransactionDraft, User, AuthDraft, DashboardStats } from '../types'
import { API_BASE_URL } from '../config'
import { sampleTransactions } from '../utils/sampleData'

const currentUserKey = 'vault-current-email'
const demoDismissedKey = 'vault-demo-dismissed'
const demoUsersKey = 'vault-demo-users-v1'
const demoTransactionsKey = 'zorvyn-finance-dashboard-v1'
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
const useDemoData = isGitHubPages

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function setCurrentUser(email: string) {
  try {
    localStorage.setItem(currentUserKey, email)
    localStorage.removeItem(demoDismissedKey)
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function clearCurrentUser() {
  try {
    localStorage.removeItem(currentUserKey)
    localStorage.setItem(demoDismissedKey, 'true')
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function getDemoUsers(): User[] {
  const stored = readJson<User[]>(demoUsersKey, [])
  return stored.length > 0 ? stored : [{
    email: 'demo@vault.finance',
    fullName: 'Demo User',
    password: 'demo123',
    theme: 'light',
    role: 'viewer',
  }]
}

function saveDemoUsers(users: User[]) {
  writeJson(demoUsersKey, users)
}

function upsertDemoUser(user: User) {
  const users = getDemoUsers()
  const index = users.findIndex(existing => existing.email.toLowerCase() === user.email.toLowerCase())
  if (index >= 0) {
    users[index] = user
  } else {
    users.unshift(user)
  }
  saveDemoUsers(users)
  setCurrentUser(user.email)
  return user
}

function getDemoCurrentUser(): User | null {
  const email = localStorage.getItem(currentUserKey)
  const users = getDemoUsers()
  if (email) {
    const user = users.find(existing => existing.email.toLowerCase() === email.toLowerCase())
    if (user) return user
  }

  const dismissed = localStorage.getItem(demoDismissedKey) === 'true'
  if (dismissed) return null

  const fallbackUser = users[0] ?? {
    email: 'demo@vault.finance',
    fullName: 'Demo User',
    password: 'demo123',
    theme: 'light',
    role: 'viewer',
  }

  saveDemoUsers([fallbackUser, ...users.filter(user => user.email.toLowerCase() !== fallbackUser.email.toLowerCase())])
  setCurrentUser(fallbackUser.email)
  return fallbackUser
}

function getDemoTransactions(): Transaction[] {
  return readJson<Transaction[]>(demoTransactionsKey, sampleTransactions)
}

function saveDemoTransactions(transactions: Transaction[]) {
  writeJson(demoTransactionsKey, transactions)
}

function createTransactionId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `tx-${Date.now()}`
}

function computeDashboardStats(transactions: Transaction[]): DashboardStats {
  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)

  return {
    totalIncome,
    totalExpense,
    currentBalance: totalIncome - totalExpense,
    transactionCount: transactions.length,
    recentTransactions: [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  }
}

function computeMonthlyTrend(transactions: Transaction[]) {
  const byMonth = new Map<string, { income: number; expense: number }>()

  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7)
    const entry = byMonth.get(month) ?? { income: 0, expense: 0 }
    entry[transaction.type] += transaction.amount
    byMonth.set(month, entry)
  }

  return [...byMonth.entries()]
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, values]) => ({ month, ...values }))
}

function computeCategoryBreakdown(transactions: Transaction[], type: 'income' | 'expense') {
  const breakdown = new Map<string, number>()

  for (const transaction of transactions.filter(tx => tx.type === type)) {
    breakdown.set(transaction.category, (breakdown.get(transaction.category) ?? 0) + transaction.amount)
  }

  return [...breakdown.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    if (useDemoData) {
      return getDemoTransactions()
    }

    try {
      const response = await api.get('/api/transactions')
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Transaction | null> {
    if (useDemoData) {
      return getDemoTransactions().find(transaction => transaction.id === id) ?? null
    }

    try {
      const response = await api.get(`/api/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
      return null
    }
  },

  async create(draft: TransactionDraft): Promise<Transaction> {
    if (useDemoData) {
      const newTransaction: Transaction = { ...draft, id: createTransactionId() }
      const transactions = getDemoTransactions()
      transactions.unshift(newTransaction)
      saveDemoTransactions(transactions)
      return newTransaction
    }

    try {
      const response = await api.post('/api/transactions', draft)
      return response.data
    } catch (error) {
      console.error('Failed to create transaction:', error)
      throw error
    }
  },

  async update(id: string, draft: Partial<TransactionDraft>): Promise<Transaction> {
    if (useDemoData) {
      const transactions = getDemoTransactions()
      const index = transactions.findIndex(transaction => transaction.id === id)
      if (index === -1) throw new Error('Transaction not found')

      const updatedTransaction = { ...transactions[index], ...draft }
      transactions[index] = updatedTransaction
      saveDemoTransactions(transactions)
      return updatedTransaction
    }

    try {
      const response = await api.put(`/api/transactions/${id}`, draft)
      return response.data
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (useDemoData) {
      const transactions = getDemoTransactions().filter(transaction => transaction.id !== id)
      saveDemoTransactions(transactions)
      return
    }

    try {
      await api.delete(`/api/transactions/${id}`)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  },

  async getByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    if (useDemoData) {
      return getDemoTransactions().filter(transaction => transaction.type === type)
    }

    try {
      const response = await api.get(`/api/transactions/type/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions by type:', error)
      throw error
    }
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    if (useDemoData) {
      return getDemoTransactions().filter(transaction => transaction.date >= startDate && transaction.date <= endDate)
    }

    try {
      const response = await api.get('/api/transactions', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions by date range:', error)
      throw error
    }
  },
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (useDemoData) {
      const users = getDemoUsers()
      const existing = users.find(user => user.email.toLowerCase() === email.toLowerCase())
      const nextUser = existing ?? {
        email,
        fullName: email.split('@')[0] || 'Demo User',
        password,
        theme: 'light',
        role: 'viewer',
      }

      const persistedUser = existing ? { ...existing, password } : nextUser
      upsertDemoUser(persistedUser)
      return persistedUser
    }

    try {
      const response = await api.post('/api/auth/login', { email, password })
      setCurrentUser(email)
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  async signup(draft: AuthDraft): Promise<User> {
    if (useDemoData) {
      const user: User = {
        email: draft.email,
        fullName: draft.fullName || draft.email.split('@')[0] || 'Demo User',
        password: draft.password,
        theme: 'light',
        role: 'viewer',
      }
      upsertDemoUser(user)
      return user
    }

    try {
      const response = await api.post('/api/auth/signup', draft)
      setCurrentUser(draft.email)
      return response.data
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (useDemoData) {
      return getDemoCurrentUser()
    }

    try {
      const email = localStorage.getItem(currentUserKey)
      if (!email) return null
      
      const response = await api.get('/api/auth/current', { params: { email } })
      return response.data
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  },

  logout(): void {
    if (useDemoData) {
      clearCurrentUser()
      return
    }

    localStorage.removeItem(currentUserKey)
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    if (useDemoData) {
      const users = getDemoUsers()
      const index = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase())
      if (index >= 0) {
        users[index] = { ...users[index], password: newPassword }
        saveDemoUsers(users)
      }
      return
    }

    try {
      await api.post('/api/auth/reset-password', { email, newPassword })
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  },
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (useDemoData) {
      return computeDashboardStats(getDemoTransactions())
    }

    try {
      const response = await api.get('/api/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  },

  async getCategoryBreakdown(type: 'income' | 'expense') {
    if (useDemoData) {
      return computeCategoryBreakdown(getDemoTransactions(), type)
    }

    try {
      const response = await api.get(`/api/dashboard/category-breakdown/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch category breakdown:', error)
      throw error
    }
  },

  async getMonthlyTrend() {
    if (useDemoData) {
      return computeMonthlyTrend(getDemoTransactions())
    }

    try {
      const response = await api.get('/api/dashboard/monthly-trend')
      return response.data
    } catch (error) {
      console.error('Failed to fetch monthly trend:', error)
      throw error
    }
  },
}
