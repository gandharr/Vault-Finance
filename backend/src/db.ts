import type { Transaction, User } from './types'
import { UserModel, TransactionModel } from './models'

export const db = {
  // User operations
  async getUser(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean()
  },

  async createUser(user: User): Promise<User> {
    const newUser = new UserModel(user)
    return newUser.save()
  },

  async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate({ email }, updates, { new: true }).lean()
  },

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return TransactionModel.find().lean()
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    return TransactionModel.findById(id).lean()
  },

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTransaction = new TransactionModel(transaction)
    return newTransaction.save()
  },

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    return TransactionModel.findByIdAndUpdate(id, updates, { new: true }).lean()
  },

  async deleteTransaction(id: string): Promise<void> {
    await TransactionModel.findByIdAndDelete(id)
  },

  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    return TransactionModel.find({ type }).lean()
  },

  async getTransactionsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    return TransactionModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean()
  },
}
