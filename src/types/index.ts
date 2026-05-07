export type TransactionType = 'income' | 'expense'
export type Role = 'viewer' | 'admin'
export type Theme = 'light' | 'dark'
export type SortMode = 'newest' | 'oldest' | 'amount-high' | 'amount-low'
export type AuthMode = 'login' | 'signup' | 'reset'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  merchant: string
  note: string
}

export type TransactionDraft = Omit<Transaction, 'id'>

export interface AuthDraft {
  fullName: string
  email: string
  password: string
}

export interface User {
  email: string
  fullName: string
  password: string
  theme: Theme
  role: Role
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  currentBalance: number
  transactionCount: number
  recentTransactions: Transaction[]
}
