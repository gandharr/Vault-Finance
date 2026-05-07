import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { dashboardService } from '../services'
import type { DashboardStats } from '../types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B']

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardStats = await dashboardService.getStats()
        const trends = await dashboardService.getMonthlyTrend()
        const categories = await dashboardService.getCategoryBreakdown('expense')
        
        setStats(dashboardStats)
        setMonthlyTrend(trends)
        setCategoryBreakdown(categories)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>
  }

  if (!stats) {
    return <div className="dashboard-container"><p>Failed to load dashboard</p></div>
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Current Balance</h3>
          <p className="metric-value">₹{stats.currentBalance.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total Income</h3>
          <p className="metric-value income">₹{stats.totalIncome.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total Expenses</h3>
          <p className="metric-value expense">₹{stats.totalExpense.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Transactions</h3>
          <p className="metric-value">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Trend */}
        <div className="chart-container">
          <h3>Monthly Trend</h3>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" />
                <Bar dataKey="expense" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty-state">Add transactions to see the monthly trend.</p>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty-state">Add an expense to see the breakdown.</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Merchant</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentTransactions.map(tx => (
              <tr key={tx.id ?? `${tx.date}-${tx.category}-${tx.amount}`}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.category}</td>
                <td>{tx.merchant}</td>
                <td>
                  <span className={`type-badge ${tx.type}`}>{tx.type}</span>
                </td>
                <td className={tx.type}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
