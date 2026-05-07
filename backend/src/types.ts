export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: 'income' | 'expense'
  merchant: string
  note?: string
}

export interface TransactionDraft extends Omit<Transaction, 'id'> {}

export interface User {
  email: string
  fullName: string
  password: string
  theme: 'light' | 'dark'
  role: 'admin' | 'user'
}

export interface AuthDraft {
  email: string
  fullName: string
  password: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  currentBalance: number
  transactionCount: number
  recentTransactions: Transaction[]
}
