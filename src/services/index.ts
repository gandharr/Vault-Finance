import axios from 'axios'
import type { Transaction, TransactionDraft, User, AuthDraft, DashboardStats } from '../types'
import { API_BASE_URL } from '../config'

const currentUserKey = 'vault-current-email'

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const response = await api.get('/api/transactions')
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Transaction | null> {
    try {
      const response = await api.get(`/api/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
      return null
    }
  },

  async create(draft: TransactionDraft): Promise<Transaction> {
    try {
      const response = await api.post('/api/transactions', draft)
      return response.data
    } catch (error) {
      console.error('Failed to create transaction:', error)
      throw error
    }
  },

  async update(id: string, draft: Partial<TransactionDraft>): Promise<Transaction> {
    try {
      const response = await api.put(`/api/transactions/${id}`, draft)
      return response.data
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/transactions/${id}`)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw error
    }
  },

  async getByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    try {
      const response = await api.get(`/api/transactions/type/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions by type:', error)
      throw error
    }
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
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
    try {
      const response = await api.post('/api/auth/login', { email, password })
      localStorage.setItem(currentUserKey, email)
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  async signup(draft: AuthDraft): Promise<User> {
    try {
      const response = await api.post('/api/auth/signup', draft)
      localStorage.setItem(currentUserKey, draft.email)
      return response.data
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User | null> {
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
    localStorage.removeItem(currentUserKey)
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
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
    try {
      const response = await api.get('/api/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  },

  async getCategoryBreakdown(type: 'income' | 'expense') {
    try {
      const response = await api.get(`/api/dashboard/category-breakdown/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch category breakdown:', error)
      throw error
    }
  },

  async getMonthlyTrend() {
    try {
      const response = await api.get('/api/dashboard/monthly-trend')
      return response.data
    } catch (error) {
      console.error('Failed to fetch monthly trend:', error)
      throw error
    }
  },
}
