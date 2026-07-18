// Root component: page shell (header/footer), client-side routing between
// the roster and the add/edit form, and the optional DevTools deterrent
// overlay. Individual screens live in ./component; this file only wires
// them together.
import './App.css'
import { EmployeeComponent } from './component/EmployeeComponent'
import { FooterComponent } from './component/FooterComponent'
import { HeaderComponent } from './component/HeaderComponent'
import { ListEmployeeComponent } from './component/ListEmployeeComponent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDevToolsGuard } from './utils/devToolsGuard'
import { ToastProvider } from './utils/ToastProvider'

// Single toggle for the DevTools deterrent - see .env.example and
// src/utils/devToolsGuard.js for what this does and does not protect
// against. Read once at module load (Vite inlines env vars at build time,
// so this is effectively a compile-time constant per environment).
const DEVTOOLS_GUARD_ENABLED = import.meta.env.VITE_DISABLE_DEVTOOLS === 'true'

function App() {
  // devToolsOpen is only ever true when the guard is enabled AND the
  // heuristic thinks a docked DevTools panel is open - see the hook for
  // exactly what that heuristic checks.
  const devToolsOpen = useDevToolsGuard(DEVTOOLS_GUARD_ENABLED)

  return (
    <BrowserRouter>
      {/* ToastProvider wraps everything below so both screens (roster and
          add/edit form) can call useToast() to confirm a save/delete. */}
      <ToastProvider>
        <div className="app-shell">
          <HeaderComponent />
          <main className="app-main">
            <Routes>
              {/* http://localhost:3000 */}
              <Route path="/" element={<ListEmployeeComponent />}></Route>

              {/* http://localhost:3000/employees */}
              <Route path="/employees" element={<ListEmployeeComponent />}></Route>

              {/* http://localhost:3000/add-employee */}
              <Route path="/add-employee" element={<EmployeeComponent />}></Route>

              {/* http://localhost:3000/update-employee/1 - :id is read via
                  useParams() inside EmployeeComponent to switch it from
                  "add" mode into "edit" mode. */}
              <Route path="/update-employee/:id" element={<EmployeeComponent />}></Route>
            </Routes>
          </main>
          <FooterComponent />
        </div>

        {/* Full-screen blocking overlay while DevTools looks open - see
            useDevToolsGuard's doc comment for why this is a deterrent only. */}
        {devToolsOpen && (
          <div className="devtools-overlay">
            <div>
              <h2>Viewer paused</h2>
              <p>Close the developer tools panel to keep using the roster.</p>
            </div>
          </div>
        )}
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
