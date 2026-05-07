import { Router, Request, Response } from 'express'
import { db } from '../db'
import type { Transaction, TransactionDraft } from '../types'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const transactions = await db.getTransactions()
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const transaction = await db.getTransaction(id)

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' })
      return
    }

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { date, amount, category, type, merchant, note } = req.body as TransactionDraft

    if (!date || !amount || !category || !type || !merchant) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const transaction = await db.createTransaction({
      date,
      amount,
      category,
      type,
      merchant,
      note,
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body as Partial<TransactionDraft>

    const transaction = await db.updateTransaction(id, updates)

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' })
      return
    }

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const transaction = await db.getTransaction(id)

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' })
      return
    }

    await db.deleteTransaction(id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const transactions = await db.getTransactionsByType(type as 'income' | 'expense')
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

export default router

