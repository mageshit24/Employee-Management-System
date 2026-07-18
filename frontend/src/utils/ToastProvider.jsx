// Lightweight, dependency-free toast notifications. Wrap the app tree in
// <ToastProvider> once (see App.jsx); any descendant can then call
// useToast() (see useToast.js) to pop a confirmation without prop-drilling
// a callback down through every screen. Deliberately not pulling in a
// toast library for this - the feature is small enough that this file
// plus useToast.js is less surface area than a new npm dependency.
import React, { useCallback, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

// Auto-dismiss after this long unless the person closes it manually.
const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    // Monotonically increasing id generator - safe even if two toasts fire
    // within the same millisecond, which Date.now() alone wouldn't guarantee.
    const nextId = useRef(0)

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback((message, tone = 'success') => {
        const id = nextId.current++
        setToasts((current) => [...current, { id, message, tone }])
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    }, [dismiss])

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-stack" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast-${t.tone}`}>
                        <span>{t.message}</span>
                        <button
                            type="button"
                            className="toast-close"
                            aria-label="Dismiss notification"
                            onClick={() => dismiss(t.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
