import type { Transaction, User } from './types.js'
import { UserModel, TransactionModel } from './models.js'

function normalizeTransaction(doc: any): Transaction | null {
  if (!doc) return null
  return {
    id: doc._id?.toString(),
    date: doc.date,
    amount: doc.amount,
    category: doc.category,
    type: doc.type,
    merchant: doc.merchant,
    note: doc.note,
  }
}

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
    const docs = await TransactionModel.find().lean()
    return docs.map(normalizeTransaction).filter((transaction: any): transaction is Transaction => Boolean(transaction))
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    const doc = await TransactionModel.findById(id).lean()
    return normalizeTransaction(doc)
  },

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTransaction = new TransactionModel(transaction)
    const saved = await newTransaction.save()
    const normalized = normalizeTransaction(saved)
    if (!normalized) {
      throw new Error('Failed to normalize transaction')
    }
    return normalized
  },

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    const doc = await TransactionModel.findByIdAndUpdate(id, updates, { new: true }).lean()
    return normalizeTransaction(doc)
  },

  async deleteTransaction(id: string): Promise<void> {
    await TransactionModel.findByIdAndDelete(id)
  },

  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const docs = await TransactionModel.find({ type }).lean()
    return docs.map(normalizeTransaction).filter((transaction: any): transaction is Transaction => Boolean(transaction))
  },

  async getTransactionsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const docs = await TransactionModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean()
    return docs.map(normalizeTransaction).filter((transaction: any): transaction is Transaction => Boolean(transaction))
  },
}
