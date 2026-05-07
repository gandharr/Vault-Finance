import type { Transaction, TransactionDraft, User, AuthDraft, DashboardStats } from '../types'

const storageKey = 'zorvyn-finance-dashboard-v1'
const usersKey = 'vault-users-db'
const currentUserKey = 'vault-current-email'

// TODO: Replace with real API calls to backend
// This is a localStorage-based implementation for now

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const data = localStorage.getItem(storageKey)
    return data ? JSON.parse(data) : []
  },

  async getById(id: string): Promise<Transaction | null> {
    const transactions = await this.getAll()
    return transactions.find(t => t.id === id) || null
  },

  async create(draft: TransactionDraft): Promise<Transaction> {
    const transactions = await this.getAll()
    const transaction: Transaction = {
      ...draft,
      id: `tx-${Date.now()}`,
    }
    transactions.push(transaction)
    localStorage.setItem(storageKey, JSON.stringify(transactions))
    return transaction
  },

  async update(id: string, draft: Partial<TransactionDraft>): Promise<Transaction> {
    const transactions = await this.getAll()
    const index = transactions.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Transaction not found')
    
    transactions[index] = { ...transactions[index], ...draft }
    localStorage.setItem(storageKey, JSON.stringify(transactions))
    return transactions[index]
  },

  async delete(id: string): Promise<void> {
    const transactions = await this.getAll()
    const filtered = transactions.filter(t => t.id !== id)
    localStorage.setItem(storageKey, JSON.stringify(filtered))
  },

  async getByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const transactions = await this.getAll()
    return transactions.filter(t => t.type === type)
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const transactions = await this.getAll()
    return transactions.filter(t => t.date >= startDate && t.date <= endDate)
  },
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}')
    const user = users[email]
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials')
    }
    
    localStorage.setItem(currentUserKey, email)
    return user
  },

  async signup(draft: AuthDraft): Promise<User> {
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}')
    
    if (users[draft.email]) {
      throw new Error('User already exists')
    }
    
    const user: User = {
      email: draft.email,
      fullName: draft.fullName,
      password: draft.password,
      theme: 'light',
      role: 'admin',
    }
    
    users[draft.email] = user
    localStorage.setItem(usersKey, JSON.stringify(users))
    localStorage.setItem(currentUserKey, draft.email)
    return user
  },

  async getCurrentUser(): Promise<User | null> {
    const email = localStorage.getItem(currentUserKey)
    if (!email) return null
    
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}')
    return users[email] || null
  },

  logout(): void {
    localStorage.removeItem(currentUserKey)
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}')
    if (!users[email]) throw new Error('User not found')
    
    users[email].password = newPassword
    localStorage.setItem(usersKey, JSON.stringify(users))
  },
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const transactions = await transactionService.getAll()
    const openingBalance = 12840
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const currentBalance = openingBalance + totalIncome - totalExpense
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
    
    return {
      totalIncome,
      totalExpense,
      currentBalance,
      transactionCount: transactions.length,
      recentTransactions,
    }
  },

  async getCategoryBreakdown(type: 'income' | 'expense') {
    const transactions = await transactionService.getByType(type)
    const breakdown: Record<string, number> = {}
    
    transactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
    })
    
    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
    }))
  },

  async getMonthlyTrend() {
    const transactions = await transactionService.getAll()
    const trend: Record<string, { income: number; expense: number }> = {}
    
    transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7) // YYYY-MM
      if (!trend[monthKey]) {
        trend[monthKey] = { income: 0, expense: 0 }
      }
      if (t.type === 'income') {
        trend[monthKey].income += t.amount
      } else {
        trend[monthKey].expense += t.amount
      }
    })
    
    return Object.entries(trend)
      .sort()
      .map(([month, data]) => ({ month, ...data }))
  },
}
