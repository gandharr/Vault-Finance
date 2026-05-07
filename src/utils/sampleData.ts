import type { Transaction } from '../types'

const storageKey = 'zorvyn-finance-dashboard-v1'

export const sampleTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2026-04-03',
    amount: 5200,
    category: 'Salary',
    type: 'income',
    merchant: 'Northstar Studio',
    note: 'Monthly design stipend',
  },
  {
    id: 'tx-002',
    date: '2026-04-02',
    amount: 1240,
    category: 'Housing',
    type: 'expense',
    merchant: 'Orchard Residence',
    note: 'Apartment rent',
  },
  {
    id: 'tx-003',
    date: '2026-04-01',
    amount: 320,
    category: 'Groceries',
    type: 'expense',
    merchant: 'Fresh Mart',
    note: 'Weekly essentials',
  },
  {
    id: 'tx-004',
    date: '2026-03-28',
    amount: 180,
    category: 'Transport',
    type: 'expense',
    merchant: 'Metro Line',
    note: 'Commute and rides',
  },
  {
    id: 'tx-005',
    date: '2026-03-26',
    amount: 620,
    category: 'Freelance',
    type: 'income',
    merchant: 'Pixel Harbor',
    note: 'Brand refresh milestone',
  },
  {
    id: 'tx-006',
    date: '2026-03-22',
    amount: 210,
    category: 'Subscriptions',
    type: 'expense',
    merchant: 'Figma',
    note: 'Team collaboration tools',
  },
  {
    id: 'tx-007',
    date: '2026-03-14',
    amount: 145,
    category: 'Dining',
    type: 'expense',
    merchant: 'Mosaic Kitchen',
    note: 'Client lunch',
  },
  {
    id: 'tx-008',
    date: '2026-02-27',
    amount: 5100,
    category: 'Salary',
    type: 'income',
    merchant: 'Northstar Studio',
    note: 'Monthly design stipend',
  },
  {
    id: 'tx-009',
    date: '2026-02-21',
    amount: 890,
    category: 'Education',
    type: 'expense',
    merchant: 'Coursera',
    note: 'Frontend specialization',
  },
  {
    id: 'tx-010',
    date: '2026-02-18',
    amount: 265,
    category: 'Utilities',
    type: 'expense',
    merchant: 'City Electric',
    note: 'Monthly utility bill',
  },
  {
    id: 'tx-011',
    date: '2026-01-29',
    amount: 470,
    category: 'Freelance',
    type: 'income',
    merchant: 'Studio Arc',
    note: 'Landing page redesign',
  },
  {
    id: 'tx-012',
    date: '2026-01-25',
    amount: 315,
    category: 'Health',
    type: 'expense',
    merchant: 'Wellness Clinic',
    note: 'Annual check-up',
  },
]

export function initializeSampleData() {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify(sampleTransactions))
    }
  } catch {
    // Storage can be unavailable in some browser contexts; the app still renders without seed data.
  }
}
