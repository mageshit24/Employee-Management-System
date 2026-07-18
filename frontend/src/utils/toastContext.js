// The React Context itself, split into its own file (rather than living in
// ToastProvider.jsx or useToast.js) so neither of those files mixes a
// component export with a non-component export - Vite's react-refresh
// lint rule requires component-only files for Fast Refresh to work
// reliably in dev.
import { createContext } from 'react'

/** @type {import('react').Context<((message: string, tone?: 'success' | 'error') => void) | null>} */
export const ToastContext = createContext(null)
