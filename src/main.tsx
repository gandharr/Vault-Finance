import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeSampleData } from './utils/sampleData'

// Initialize sample data only when demo mode is explicitly enabled
// via `VITE_ENABLE_DEMO=true`. This prevents unexpected demo data
// from appearing for real users on public deployments.
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_DEMO === 'true') {
  initializeSampleData()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
