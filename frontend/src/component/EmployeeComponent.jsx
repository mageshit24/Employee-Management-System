// Add/edit form for a single employee. Doubles as both screens: with no
// :id route param it's the "add" form; with one, it loads that employee
// and becomes the "edit" form. Validates client-side before submitting
// (mirroring the backend's Bean Validation rules) so most bad input never
// makes a network round trip, and still surfaces server-side validation
// errors if they occur.
import React, { useEffect, useState } from 'react'
import { createEmployee, getEmployee, updateEmployee } from '../services/employeeService'
import { useNavigate, useParams } from 'react-router-dom'
import { logger } from '../utils/logger'
import { useToast } from '../utils/useToast'

// Deliberately simple - a full RFC 5322 email regex is famously enormous
// and still imperfect. This mirrors the backend's @Email intent (reject
// obviously malformed input) without pretending to fully validate
// deliverability; the backend remains the source of truth.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EmployeeComponent = () => {
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Top-of-form error banner for failures that aren't tied to one field
  // (e.g. "record not found" while loading, or a server-side save error).
  const [banner, setBanner] = useState('')

  // Presence of :id from the route decides add-mode vs edit-mode
  // everywhere in this component.
  const { id } = useParams()

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
  })

  const navigate = useNavigate()
  const showToast = useToast()

  // Edit mode only: fetch the existing record once on mount (or if the
  // :id param itself changes, e.g. navigating directly between two edit
  // URLs) and prefill the form fields from it.
  useEffect(() => {
    if (id) {
      getEmployee(id)
        .then((response) => {
          setFirstName(response.data.firstname)
          setLastName(response.data.lastname)
          setEmail(response.data.email)
        })
        .catch(() => {
          logger.error('Failed to load employee for editing')
          setBanner('Could not load this record. It may have been removed.')
        })
    }
  }, [id])

  // Form submit handler for both add and edit - which API call fires is
  // decided purely by whether :id is present.
  function saveOrUpdateEmployee(e) {
    e.preventDefault()
    setBanner('')
    if (!validateForm()) return

    const employee = { firstname: firstname.trim(), lastname: lastname.trim(), email: email.trim() }
    setSubmitting(true)

    const request = id ? updateEmployee(id, employee) : createEmployee(employee)

    request
      .then(() => {
        showToast(id ? 'Record updated.' : 'Employee added to the roster.', 'success')
        navigate('/employees')
      })
      .catch((error) => {
        logger.error('Failed to save employee')
        // Surface the backend's validation/conflict message when there is
        // one (e.g. "An employee with this email already exists.") -
        // GlobalExceptionHandler on the backend guarantees this field
        // never contains a stack trace or raw SQL, so it's safe to render.
        const serverMessage = error?.response?.data?.message
        setBanner(serverMessage || 'Could not save this record. Please try again.')
      })
      .finally(() => setSubmitting(false))
  }

  // Client-side mirror of the backend's @NotBlank/@Email/@Size rules -
  // catches obvious mistakes immediately, before a network round trip.
  // The backend re-validates regardless, since client-side checks can
  // always be bypassed.
  function validateForm() {
    let valid = true
    const errorsCopy = { ...errors }

    if (firstname.trim()) {
      errorsCopy.firstname = ''
    } else {
      errorsCopy.firstname = 'First name is required'
      valid = false
    }

    if (lastname.trim()) {
      errorsCopy.lastname = ''
    } else {
      errorsCopy.lastname = 'Last name is required'
      valid = false
    }

    if (!email.trim()) {
      errorsCopy.email = 'Email is required'
      valid = false
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errorsCopy.email = 'Enter a valid email address'
      valid = false
    } else {
      errorsCopy.email = ''
    }

    setErrors(errorsCopy)
    return valid
  }

  return (
    <div className="intake-card">
      <p className="intake-eyebrow">{id ? 'Amend record' : 'New record'}</p>
      <h2 className="intake-title">{id ? 'Update employee' : 'Add employee'}</h2>

      {banner && <div className="form-banner error">{banner}</div>}

      <form onSubmit={saveOrUpdateEmployee} noValidate>
        <div className="field-group">
          <label className="field-label" htmlFor="firstname">First name</label>
          <input
            id="firstname"
            type="text"
            placeholder="Enter first name"
            value={firstname}
            className={`field-input ${errors.firstname ? 'has-error' : ''}`}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstname && <div className="field-error">{errors.firstname}</div>}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="lastname">Last name</label>
          <input
            id="lastname"
            type="text"
            placeholder="Enter last name"
            value={lastname}
            className={`field-input ${errors.lastname ? 'has-error' : ''}`}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastname && <div className="field-error">{errors.lastname}</div>}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            className={`field-input ${errors.email ? 'has-error' : ''}`}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save record'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/employees')} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
