import { Link } from 'react-router-dom'
import { authService } from '../services'

interface NavigationProps {
  onLogout: () => void
}

export const Navigation = ({ onLogout }: NavigationProps) => {
  const logoSrc = `${import.meta.env.BASE_URL}favicon.svg`

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logoSrc} alt="Vault Finance Logo" className="logo-icon" />
          <span>Vault Finance</span>
        </Link>

        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/transactions" className="nav-link">
            Transactions
          </Link>
          <Link to="/reports" className="nav-link">
            Reports
          </Link>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
