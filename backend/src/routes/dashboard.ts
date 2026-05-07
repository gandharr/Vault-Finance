import { Router, Request, Response } from 'express'
import { db } from '../db'
import type { DashboardStats } from '../types'

const router = Router()

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const transactions = await db.getTransactions()
    const OPENING_BALANCE = 12840

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = OPENING_BALANCE + totalIncome - totalExpense
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    const stats: DashboardStats = {
      totalIncome,
      totalExpense,
      currentBalance,
      transactionCount: transactions.length,
      recentTransactions,
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

router.get('/category-breakdown/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params

    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ error: 'Type must be income or expense' })
      return
    }

    const transactions = await db.getTransactionsByType(type as 'income' | 'expense')

    const breakdown: Record<string, number> = {}
    transactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
    })

    const result = Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category breakdown' })
  }
})

router.get('/monthly-trend', async (req: Request, res: Response) => {
  try {
    const transactions = await db.getTransactions()

    const monthlyData: Record<string, { income: number; expense: number }> = {}

    transactions.forEach(t => {
      const date = new Date(t.date)
      const month = date.toISOString().slice(0, 7) // YYYY-MM

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 }
      }

      if (t.type === 'income') {
        monthlyData[month].income += t.amount
      } else {
        monthlyData[month].expense += t.amount
      }
    })

    const result = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data,
      }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly trend' })
  }
})

export default router
