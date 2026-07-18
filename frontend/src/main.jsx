// Client entry point - mounts the React tree into the <div id="root">
// declared in index.html. Nothing but bootstrapping belongs here; app
// structure lives in App.jsx.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Bootstrap CSS has been replaced by the custom design system in
// index.css / App.css - see .env.example and App.jsx for the rest of
// the setup.

// StrictMode double-invokes effects/renders in development only (to surface
// side-effect bugs early) - it's a no-op in the production build.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
