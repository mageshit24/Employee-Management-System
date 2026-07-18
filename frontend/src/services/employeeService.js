// Thin Axios wrapper around the backend's /api/employees REST endpoints.
// Every component talks to the API only through the functions exported
// here - nothing else in the frontend constructs a URL or calls axios
// directly, so there's exactly one place to change if the API shape ever
// moves.
import axios from 'axios'

// Was hardcoded to http://localhost:8080/api/employees, which meant every
// deployment needed a code change (and a rebuild) just to point at a
// different backend. Now driven by an env var, with the old value kept
// only as the local-dev fallback. See .env.example.
const REST_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/employees'

// A shared instance (rather than bare axios.*) so the base URL and a
// sane request timeout are applied consistently to every call below -
// without this, a hung backend could leave a request pending forever.
const client = axios.create({
    baseURL: REST_API_BASE_URL,
    timeout: 10000,
})

/**
 * GET /api/employees - fetch the roster, optionally filtered and sorted.
 * @param {{ q?: string, sortBy?: string, sortDir?: string }} [params]
 *   q: free-text search (matches first name, last name, or email)
 *   sortBy: 'firstname' | 'lastname' | 'email' | 'id'
 *   sortDir: 'asc' | 'desc'
 * Axios omits any key whose value is undefined, so calling this with no
 * args (or with some params left out) just falls through to the
 * backend's own defaults.
 */
export const listEmployees = (params) => client.get('', { params })

/** POST /api/employees - create a new employee from a { firstname, lastname, email } payload. */
export const createEmployee = (employee) => client.post('', employee)

/** GET /api/employees/{id} - fetch one employee, used when opening the edit form. */
export const getEmployee = (employeeId) => client.get(`/${employeeId}`)

/** PUT /api/employees/{id} - overwrite an existing employee's fields. */
export const updateEmployee = (employeeId, employee) => client.put(`/${employeeId}`, employee)

/** DELETE /api/employees/{id} - remove an employee permanently. */
export const deleteEmployee = (employeeId) => client.delete(`/${employeeId}`)
