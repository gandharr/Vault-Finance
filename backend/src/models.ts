import mongoose, { Document, Schema } from 'mongoose'
import type { User, Transaction } from './types.js'

// User Schema
const userSchema = new Schema<User & Document>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
  },
  { timestamps: true }
)

// Transaction Schema
const transactionSchema = new Schema<Transaction & Document>(
  {
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    merchant: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<User & Document>('User', userSchema)
export const TransactionModel = mongoose.model<Transaction & Document>(
  'Transaction',
  transactionSchema
)
