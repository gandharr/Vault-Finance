import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services'
import { API_BASE_URL } from './config'
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
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  useEffect(() => {
    // First check backend health. If healthy, load the current user.
    const checkHealthThenLoad = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/health`, { method: 'GET' })
        const healthy = resp.ok
        setApiHealthy(healthy)

        if (!healthy) {
          setLoading(false)
          return
        }

        try {
          const user = await authService.getCurrentUser()
          setCurrentUser(user)
        } catch (error) {
          console.error('Failed to load user:', error)
        } finally {
          setLoading(false)
        }
      } catch (err) {
        console.error('Health check failed:', err)
        setApiHealthy(false)
        setLoading(false)
      }
    }

    checkHealthThenLoad()
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

  if (apiHealthy === false || apiHealthy === null) {
    return (
      <div className="maintenance">
        <h2>Service temporarily unavailable</h2>
        <p>The backend API is currently unreachable. The site is running without demo data.</p>
        <button onClick={async () => {
          setLoading(true)
          try {
            const resp = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/health`)
            setApiHealthy(resp.ok)
            if (resp.ok) {
              setLoading(true)
              const user = await authService.getCurrentUser()
              setCurrentUser(user)
            }
          } catch (e) {
            console.error('Retry health check failed', e)
            setApiHealthy(false)
          } finally {
            setLoading(false)
          }
        }}>Retry</button>
      </div>
    )
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
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
