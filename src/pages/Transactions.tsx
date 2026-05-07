import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Transaction, TransactionDraft } from '../types'
import { transactionService } from '../services'

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<TransactionDraft>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: '',
    type: 'expense',
    merchant: '',
    note: '',
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [transactions, filter, sortBy, searchTerm])

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let result = [...transactions]

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(t => t.type === filter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        t =>
          t.merchant.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.note.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'amount-high':
          return b.amount - a.amount
        case 'amount-low':
          return a.amount - b.amount
        default:
          return 0
      }
    })

    setFilteredTransactions(result)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      await transactionService.create(formData)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: '',
        type: 'expense',
        merchant: '',
        note: '',
      })
      setShowForm(false)
      await loadTransactions()
    } catch (error) {
      console.error('Failed to create transaction:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id)
        await loadTransactions()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  if (loading) {
    return <div className="transactions-container"><p>Loading...</p></div>
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Groceries, Salary"
                required
              />
            </div>
            <div className="form-group">
              <label>Merchant</label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleInputChange}
                placeholder="e.g., Whole Foods"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <button type="submit" className="btn-primary">
            Save Transaction
          </button>
        </form>
      )}

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>

        <div className="filter-group filter-search-group">
          <label className="sr-only">Search transactions</label>
          <input
            type="text"
            placeholder="Search by merchant, category, or note..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <p className="no-data">No transactions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Merchant</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.category}</td>
                  <td>{tx.merchant}</td>
                  <td>
                    <span className={`type-badge ${tx.type}`}>{tx.type}</span>
                  </td>
                  <td className={tx.type}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </td>
                  <td>{tx.note}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(tx.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
