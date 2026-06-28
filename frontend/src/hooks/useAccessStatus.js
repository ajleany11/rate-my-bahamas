import { useEffect, useState } from 'react'
import { isAuthenticated } from '../api/auth'
import { getPaymentStatus } from '../api/billing'

// Returns { status, semester } where status is 'checking' | 'guest' | 'unpaid' | 'active'.
export function useAccessStatus() {
  const [state, setState] = useState({ status: 'checking', semester: null })

  useEffect(() => {
    let cancelled = false

    async function check() {
      if (!(await isAuthenticated())) {
        if (!cancelled) setState({ status: 'guest', semester: null })
        return
      }
      try {
        const data = await getPaymentStatus()
        if (!cancelled) {
          setState({ status: data.has_access ? 'active' : 'unpaid', semester: data.semester })
        }
      } catch {
        if (!cancelled) setState({ status: 'unpaid', semester: null })
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
