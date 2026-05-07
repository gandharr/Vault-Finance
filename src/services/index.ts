import axios from 'axios'
import type { Transaction, TransactionDraft, User, AuthDraft, DashboardStats } from '../types'
import { resolveApiBaseUrl } from '../config'

const currentUserKey = 'vault-current-email'

// Axios instance
const api = axios.create({
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  config.baseURL = await resolveApiBaseUrl()
  return config
})

function getFriendlyError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { error?: string; message?: string } | undefined)?.error ??
      (error.response?.data as { error?: string; message?: string } | undefined)?.message

    if (responseMessage) {
      return new Error(responseMessage)
    }

    if (!error.response) {
      return new Error(fallbackMessage)
    }
  }

  if (error instanceof Error) {
    return error
  }

  return new Error(fallbackMessage)
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const response = await api.get('/api/transactions')
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async getById(id: string): Promise<Transaction | null> {
    try {
      const response = await api.get(`/api/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async create(draft: TransactionDraft): Promise<Transaction> {
    try {
      const response = await api.post('/api/transactions', draft)
      return response.data
    } catch (error) {
      console.error('Failed to create transaction:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async update(id: string, draft: Partial<TransactionDraft>): Promise<Transaction> {
    try {
      const response = await api.put(`/api/transactions/${id}`, draft)
      return response.data
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/transactions/${id}`)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async getByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    try {
      const response = await api.get(`/api/transactions/type/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch transactions by type:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
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
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
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
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async signup(draft: AuthDraft): Promise<User> {
    try {
      const response = await api.post('/api/auth/signup', draft)
      localStorage.setItem(currentUserKey, draft.email)
      return response.data
    } catch (error) {
      console.error('Signup failed:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
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
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
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
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async getCategoryBreakdown(type: 'income' | 'expense') {
    try {
      const response = await api.get(`/api/dashboard/category-breakdown/${type}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch category breakdown:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },

  async getMonthlyTrend() {
    try {
      const response = await api.get('/api/dashboard/monthly-trend')
      return response.data
    } catch (error) {
      console.error('Failed to fetch monthly trend:', error)
      throw getFriendlyError(error, 'Backend is unavailable. Please try again later.')
    }
  },
}
