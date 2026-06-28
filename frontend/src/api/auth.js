// Relative: the Vite dev proxy forwards /api in dev, and production serves
// frontend + backend from the same origin (see vite.config.js).
const API_BASE_URL = ''

function extractErrorMessage(data) {
  if (!data || typeof data !== 'object') return 'Something went wrong. Please try again.'
  const firstKey = Object.keys(data)[0]
  if (!firstKey) return 'Something went wrong. Please try again.'
  const value = data[firstKey]
  return Array.isArray(value) ? value[0] : String(value)
}

function decodeJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp
  } catch {
    return null
  }
}

function isExpired(token) {
  const exp = decodeJwtExp(token)
  if (!exp) return true
  return Date.now() >= exp * 1000
}

async function postJson(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(res.status === 401 ? 'Invalid email or password.' : extractErrorMessage(data))
  }
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export async function register({ fullName, ubEmail, password, password2 }) {
  return postJson('/api/accounts/register/', {
    full_name: fullName,
    ub_email: ubEmail,
    password,
    password2,
  })
}

export async function verifyEmail({ email, code }) {
  return postJson('/api/accounts/verify-email/', { email, code })
}

export async function requestPasswordReset({ email }) {
  return postJson('/api/accounts/password-reset/request/', { email })
}

export async function verifyPasswordReset({ email, code }) {
  return postJson('/api/accounts/password-reset/verify/', { email, code })
}

export async function confirmPasswordReset({ resetToken, newPassword, newPassword2 }) {
  return postJson('/api/accounts/password-reset/confirm/', {
    reset_token: resetToken,
    new_password: newPassword,
    new_password2: newPassword2,
  })
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) return null

  const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!res.ok) {
    logout()
    return null
  }
  const data = await res.json()
  localStorage.setItem('access', data.access)
  return data.access
}

// Returns a valid (non-expired) access token, refreshing it first if needed.
// Returns null if the user isn't logged in or the refresh token has also expired.
export async function ensureValidAccessToken() {
  const access = localStorage.getItem('access')
  if (!access) return null
  if (!isExpired(access)) return access
  return refreshAccessToken()
}

export async function isAuthenticated() {
  return !!(await ensureValidAccessToken())
}

export function getAccessToken() {
  return localStorage.getItem('access')
}

// fetch wrapper for authenticated requests: attaches the access token,
// refreshing it first if it has expired.
export async function authFetch(path, options = {}) {
  const token = await ensureValidAccessToken()
  if (!token) {
    throw new Error('Not authenticated.')
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
