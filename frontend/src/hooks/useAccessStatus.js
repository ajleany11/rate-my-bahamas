import { useEffect, useState } from 'react'
import { isAuthenticated } from '../api/auth'
import { getPaymentStatus } from '../api/billing'

// Returns { status, semester, onTrial, trialDaysRemaining } where
// status is 'checking' | 'guest' | 'unpaid' | 'active'.
export function useAccessStatus() {
  const [state, setState] = useState({ status: 'checking', semester: null, onTrial: false, trialDaysRemaining: null })

  useEffect(() => {
    let cancelled = false

    async function check() {
      if (!(await isAuthenticated())) {
        if (!cancelled) setState({ status: 'guest', semester: null, onTrial: false, trialDaysRemaining: null })
        return
      }
      try {
        const data = await getPaymentStatus()
        if (!cancelled) {
          setState({
            status: data.has_access ? 'active' : 'unpaid',
            semester: data.semester,
            onTrial: data.on_trial ?? false,
            trialDaysRemaining: data.trial_days_remaining ?? null,
          })
        }
      } catch {
        if (!cancelled) setState({ status: 'guest', semester: null, onTrial: false, trialDaysRemaining: null })
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
