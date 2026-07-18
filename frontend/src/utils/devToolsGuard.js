import { useEffect, useState } from 'react'

/**
 * Deterrent-only DevTools guard, toggled by a single parameter.
 *
 * IMPORTANT - read before enabling: none of this is real security. Any
 * user who wants to read this app's JavaScript, inspect network requests,
 * or tamper with the DOM can do so regardless of these checks - detaching
 * DevTools, using a proxy, or simply disabling JavaScript execution of this
 * guard all bypass it trivially. Its only job is to raise friction for
 * casual users on a public demo/kiosk. Never rely on it to hide secrets:
 * there should be no API keys, tokens, or sensitive logic in frontend code
 * in the first place (that's what the backend's validation, CORS allow-list
 * and error handling are for).
 *
 * @param {boolean} enabled - single on/off toggle. Wire this to
 *   import.meta.env.VITE_DISABLE_DEVTOOLS (see .env.example) or pass a
 *   literal true/false to override per environment.
 * @returns {boolean} whether DevTools currently appear to be open (only
 *   meaningful while enabled=true).
 */
export function useDevToolsGuard(enabled) {
    const [devToolsOpen, setDevToolsOpen] = useState(false)

    useEffect(() => {
        if (!enabled) return

        const blockedKeydown = (e) => {
            const key = e.key?.toLowerCase()
            const isF12 = key === 'f12'
            const isInspectShortcut = (e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)
            const isViewSource = (e.ctrlKey || e.metaKey) && key === 'u'
            if (isF12 || isInspectShortcut || isViewSource) {
                e.preventDefault()
            }
        }

        const blockContextMenu = (e) => e.preventDefault()

        // Heuristic only: a docked DevTools panel changes the gap between
        // outer and inner window dimensions. Undocked/second-monitor DevTools
        // won't trigger this, and that is expected and fine for a deterrent.
        const THRESHOLD = 160
        const checkDimensions = () => {
            const widthGap = window.outerWidth - window.innerWidth
            const heightGap = window.outerHeight - window.innerHeight
            setDevToolsOpen(widthGap > THRESHOLD || heightGap > THRESHOLD)
        }

        window.addEventListener('keydown', blockedKeydown)
        window.addEventListener('contextmenu', blockContextMenu)
        checkDimensions()
        const interval = setInterval(checkDimensions, 1000)

        return () => {
            window.removeEventListener('keydown', blockedKeydown)
            window.removeEventListener('contextmenu', blockContextMenu)
            clearInterval(interval)
        }
    }, [enabled])

    return enabled && devToolsOpen
}
