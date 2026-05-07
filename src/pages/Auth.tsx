import { useState } from 'react'
import type { FormEvent } from 'react'
import { authService } from '../services'
import type { AuthMode, AuthDraft } from '../types'

interface AuthPageProps {
  onAuthSuccess: () => void
}

export const Auth = ({ onAuthSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<AuthDraft>({
    fullName: '',
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(formData.email, formData.password)
      onAuthSuccess()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.signup(formData)
      onAuthSuccess()
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.resetPassword(formData.email, formData.password)
      setError('') // Clear error
      setMode('login')
      setFormData({ fullName: '', email: '', password: '' })
      // Show success message
      alert('Password reset successfully!')
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Vault Finance</h1>
        <p className="subtitle">Manage your finances with ease</p>

        {error && <div className="error-message">{error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="auth-switch">
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setFormData({ fullName: '', email: '', password: '' })
                }}
              >
                Sign up
              </button>
            </p>
            <p className="auth-switch">
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('reset')
                  setError('')
                  setFormData({ fullName: '', email: '', password: '' })
                }}
              >
                Forgot password?
              </button>
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="auth-switch">
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setFormData({ fullName: '', email: '', password: '' })
                }}
              >
                Login
              </button>
            </p>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New password"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p className="auth-switch">
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setFormData({ fullName: '', email: '', password: '' })
                }}
              >
                Back to login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
