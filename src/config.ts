// API configuration
// Always prefer `VITE_API_URL`. If not provided, default to the hosted API.
// NOTE: localhost fallback removed to avoid accidental local addresses on public builds.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'gandharr.github.io/Vault-Finance/'
