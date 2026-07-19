// Landing screen: the employee roster. Handles its own loading/error/empty
// states, a debounced search box and sort control wired to the backend's
// GET /api/employees?q=&sortBy=&sortDir= endpoint, a small stats strip,
// and a two-step (click "Remove" -> confirm in a dialog) delete flow so a
// record can't be removed by a single accidental click.
import React, { useEffect, useState } from 'react'
import { deleteEmployee, listEmployees } from '../services/employeeService'
import { useNavigate } from 'react-router-dom'
import { logger } from '../utils/logger'
import { useToast } from '../utils/useToast'

/** Two-letter avatar initials for a record card, e.g. "Jane Doe" -> "JD". Falls back to "?" if both names are blank. */
function initials(firstname, lastname) {
    const a = firstname?.trim()?.[0] || ''
    const b = lastname?.trim()?.[0] || ''
    return (a + b).toUpperCase() || '?'
}

// Options for the combined sort control - value packs sortBy/sortDir
// together since the roster only ever needs one active sort at a time.
const SORT_OPTIONS = [
    { value: 'firstname-asc', label: 'Name (A\u2013Z)', sortBy: 'firstname', sortDir: 'asc' },
    { value: 'firstname-desc', label: 'Name (Z\u2013A)', sortBy: 'firstname', sortDir: 'desc' },
    { value: 'email-asc', label: 'Email (A\u2013Z)', sortBy: 'email', sortDir: 'asc' },
    { value: 'id-desc', label: 'Newest first', sortBy: 'id', sortDir: 'desc' },
    { value: 'id-asc', label: 'Oldest first', sortBy: 'id', sortDir: 'asc' },
]

// How long to wait after the last keystroke before actually querying the
// backend - keeps a fast typist from firing a request per character.
const SEARCH_DEBOUNCE_MS = 300

export const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([])
    // Drives which of the loading/error/empty/list states renders below,
    // instead of juggling several booleans that could contradict each other.
    const [status, setStatus] = useState('loading') // loading | ready | error
    const [searchInput, setSearchInput] = useState('')
    const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value)
    // The employee currently targeted by the delete-confirm dialog, or null
    // when the dialog is closed.
    const [pendingDelete, setPendingDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    // Captured whenever an unfiltered fetch completes, so the stats strip
    // can show "N on file" even while a search is narrowing the visible
    // list - without a second API call just to count everything.
    const [totalCount, setTotalCount] = useState(null)
    const navigate = useNavigate()
    const showToast = useToast()

    // Re-fetch whenever the sort changes immediately, or the search box
    // changes after the debounce window - both funnel into the same
    // fetchRoster call so there's one code path talking to the API.
    useEffect(() => {
        const handle = setTimeout(() => {
            fetchRoster()
        }, searchInput ? SEARCH_DEBOUNCE_MS : 0)
        return () => clearTimeout(handle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, sortValue])

    /** Fetches the roster from the API using the current search/sort state. Also used to refresh the list and to retry after an error. */
    function fetchRoster() {
        setStatus('loading')
        const option = SORT_OPTIONS.find((o) => o.value === sortValue) || SORT_OPTIONS[0]
        const trimmedQuery = searchInput.trim()
        listEmployees({ q: trimmedQuery || undefined, sortBy: option.sortBy, sortDir: option.sortDir })
            .then((response) => {
                setEmployees(response.data)
                if (!trimmedQuery) setTotalCount(response.data.length)
                setStatus('ready')
            })
            .catch(() => {
                logger.error('Failed to load employee roster')
                setStatus('error')
            })
    }

    function addNewEmployee() {
        navigate('/add-employee')
    }

    function goToUpdate(id) {
        navigate(`/update-employee/${id}`)
    }

    /** Called from the confirm dialog's "Remove record" button - actually deletes pendingDelete, then refreshes the roster. */
    function confirmDelete() {
        if (!pendingDelete) return
        setDeleting(true)
        const name = `${pendingDelete.firstname} ${pendingDelete.lastname}`.trim()
        deleteEmployee(pendingDelete.id)
            .then(() => {
                setPendingDelete(null)
                showToast(`Removed ${name} from the roster.`, 'success')
                fetchRoster()
            })
            .catch(() => {
                logger.error('Failed to delete employee')
                showToast('Could not remove this record. Please try again.', 'error')
            })
            .finally(() => setDeleting(false))
    }

    /** Copies an employee's email to the clipboard and confirms it with a toast - a small convenience for reaching out without retyping the address. */
    function copyEmail(email) {
        navigator.clipboard?.writeText(email)
            .then(() => showToast('Email copied to clipboard.', 'success'))
            .catch(() => showToast('Could not copy the email address.', 'error'))
    }

    const isFiltering = searchInput.trim().length > 0

    return (
        <div>
            <div className="roster-header">
                <div>
                    <h1>Roster</h1>
                    <p className="roster-count">
                        {status === 'ready'
                            ? `${employees.length} record${employees.length === 1 ? '' : 's'}${isFiltering ? ' matching your search' : ' on file'}`
                            : '\u00A0'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={addNewEmployee}>+ Add employee</button>
            </div>

            <div className="stats-strip">
                <div className="stat-chip">
                    <span className="stat-value">{totalCount ?? '\u2013'}</span>
                    <span className="stat-label">On file</span>
                </div>
                {isFiltering && status === 'ready' && (
                    <div className="stat-chip">
                        <span className="stat-value">{employees.length}</span>
                        <span className="stat-label">Matching</span>
                    </div>
                )}
            </div>

            <div className="roster-toolbar">
                <input
                    type="search"
                    className="field-input roster-search"
                    placeholder="Search by name or email…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    aria-label="Search employees"
                />
                <select
                    className="field-input roster-sort"
                    value={sortValue}
                    onChange={(e) => setSortValue(e.target.value)}
                    aria-label="Sort employees"
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            {status === 'loading' && (
                <div className="record-list" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <div className="record-card skeleton-card" key={i}>
                            <div className="skeleton skeleton-avatar" />
                            <div className="record-main">
                                <div className="skeleton skeleton-line" style={{ width: '40%' }} />
                                <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === 'error' && (
                <div className="state-panel error">
                    <h3>Couldn&apos;t load the roster</h3>
                    <p>Check that the backend is running, then try again.</p>
                    <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={fetchRoster}>Retry</button>
                </div>
            )}

            {status === 'ready' && employees.length === 0 && isFiltering && (
                <div className="state-panel">
                    <h3>No matches</h3>
                    <p>Nothing matches &ldquo;{searchInput}&rdquo;. Try a different name or email.</p>
                </div>
            )}

            {status === 'ready' && employees.length === 0 && !isFiltering && (
                <div className="state-panel">
                    <h3>No employees yet</h3>
                    <p>Add the first record to start the roster.</p>
                </div>
            )}

            {status === 'ready' && employees.length > 0 && (
                <div className="record-list">
                    {employees.map((employee) => (
                        <div className="record-card" key={employee.id}>
                            <div className="record-avatar">{initials(employee.firstname, employee.lastname)}</div>
                            <div className="record-main">
                                <div className="record-name">{employee.firstname} {employee.lastname}</div>
                                <div className="record-email">{employee.email}</div>
                            </div>
                            <span className="record-badge">№ {String(employee.id).padStart(4, '0')}</span>
                            <div className="record-actions">
                                <button
                                    className="btn btn-ghost btn-sm btn-icon"
                                    onClick={() => copyEmail(employee.email)}
                                    aria-label={`Copy ${employee.firstname}'s email`}
                                    title="Copy email"
                                >
                                    ⧉
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={() => goToUpdate(employee.id)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => setPendingDelete(employee)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pendingDelete && (
                <div className="overlay" role="dialog" aria-modal="true">
                    <div className="confirm-card">
                        <h3>Remove {pendingDelete.firstname} {pendingDelete.lastname}?</h3>
                        <p>This deletes the record permanently. It can&apos;t be undone.</p>
                        <div className="confirm-actions">
                            <button className="btn btn-ghost" onClick={() => setPendingDelete(null)} disabled={deleting}>Cancel</button>
                            <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? 'Removing…' : 'Remove record'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
