import { authFetch, isAuthenticated } from './auth'

function extractErrorMessage(data) {
  if (!data || typeof data !== 'object') return 'Something went wrong. Please try again.'
  const firstKey = Object.keys(data)[0]
  if (!firstKey) return 'Something went wrong. Please try again.'
  const value = data[firstKey]
  return Array.isArray(value) ? value[0] : String(value)
}

export async function getPaymentStatus() {
  const res = await authFetch('/api/billing/status/')
  const data = await res.json()
  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data
}

export async function createCheckoutSession() {
  const res = await authFetch('/api/billing/checkout/', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data
}

export async function hasActiveAccess() {
  if (!(await isAuthenticated())) return false
  try {
    const data = await getPaymentStatus()
    return data.has_access
  } catch {
    return false
  }
}
