// Site masthead shown on every screen. The title links back to the roster
// so it doubles as a "home" affordance - no separate nav menu needed for
// an app this small. Also hosts the light/dark theme toggle, since a
// masthead is the one element present on every screen.
import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../utils/useTheme'

export const HeaderComponent = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="masthead-row">
          <div>
            <p className="masthead-eyebrow">Records Office &middot; Roster</p>
            <h1 className="masthead-title">
              <Link to="/employees">Employee Management System</Link>
            </h1>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
