// Light/dark theme toggle. Applies a `data-theme` attribute to <html>,
// which index.css switches its CSS custom properties on - no separate
// dark-mode stylesheet to keep in sync. Persisted in localStorage so the
// choice survives a refresh; this is a real deployed app running in a
// normal browser (not a sandboxed artifact), so localStorage is fine here.
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ems-theme'

function getInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    // Fall back to the OS/browser preference on first visit, before the
    // person has made an explicit choice of their own.
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** @returns {['light' | 'dark', () => void]} current theme and a toggle function */
export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        try {
            window.localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // Private browsing / storage disabled - the toggle still works for
            // the current tab, it just won't persist across a reload.
        }
    }, [theme])

    const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

    return [theme, toggleTheme]
}
