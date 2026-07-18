import { useContext } from 'react'
import { ToastContext } from './toastContext'

/**
 * @returns {(message: string, tone?: 'success' | 'error') => void}
 *   Call this to pop a toast. Throws if used outside a ToastProvider,
 *   which is intentional - a silent no-op would hide a wiring mistake.
 */
export function useToast() {
    const showToast = useContext(ToastContext)
    if (!showToast) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return showToast
}
