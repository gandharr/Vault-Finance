// API configuration
// In development, use the local backend.
// In production builds (including GitHub Pages), use the hosted backend unless overridden.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
	import.meta.env.DEV ? 'http://localhost:3001' : 'https://vault-finance-api.onrender.com'
)
