import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { dashboardService, transactionService } from '../services'
import { Transaction } from '../types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B', '#8884d8', '#82ca9d']

export const Reports = () => {
  const [incomeBreakdown, setIncomeBreakdown] = useState<any[]>([])
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([])
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      const transactions = await transactionService.getAll()
      const income = await dashboardService.getCategoryBreakdown('income')
      const expenses = await dashboardService.getCategoryBreakdown('expense')
      const trends = await dashboardService.getMonthlyTrend()

      setIncomeBreakdown(income)
      setExpenseBreakdown(expenses)
      setMonthlyTrend(trends)

      // Calculate statistics
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const avgTransaction = transactions.length > 0 
        ? (totalIncome + totalExpense) / transactions.length 
        : 0

      const largestIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((max, t) => (t.amount > max ? t.amount : max), 0)

      const largestExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((max, t) => (t.amount > max ? t.amount : max), 0)

      setStatistics({
        totalIncome,
        totalExpense,
        avgTransaction,
        largestIncome,
        largestExpense,
        savingsRate: totalIncome > 0 
          ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(2)
          : 0,
      })
    } catch (error) {
      console.error('Failed to load report data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="reports-container"><p>Loading...</p></div>
  }

  return (
    <div className="reports-container">
      <h1>Financial Reports</h1>

      {/* Key Statistics */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Income</h4>
            <p className="stat-value">${statistics.totalIncome.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Total Expense</h4>
            <p className="stat-value">${statistics.totalExpense.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Savings Rate</h4>
            <p className="stat-value">{statistics.savingsRate}%</p>
          </div>
          <div className="stat-card">
            <h4>Largest Income</h4>
            <p className="stat-value">${statistics.largestIncome.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Largest Expense</h4>
            <p className="stat-value">${statistics.largestExpense.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Avg Transaction</h4>
            <p className="stat-value">${statistics.avgTransaction.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="reports-grid">
        {/* Income by Category */}
        {incomeBreakdown.length > 0 && (
          <div className="report-card">
            <h3>Income by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {incomeBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense by Category */}
        {expenseBreakdown.length > 0 && (
          <div className="report-card">
            <h3>Expense by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="report-card full-width">
        <h3>Income vs Expense Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="#00C49F" name="Income" />
            <Bar dataKey="expense" fill="#FF8042" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Comparison */}
      <div className="report-card full-width">
        <h3>Expense Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expenseBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="amount" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
