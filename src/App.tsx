import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services'
import type { User } from './types'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Reports } from './pages/Reports'
import { Auth } from './pages/Auth'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleAuthSuccess = () => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    loadUser()
  }

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <Router>
      {currentUser ? (
        <>
          <Navigation onLogout={() => setCurrentUser(null)} />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
