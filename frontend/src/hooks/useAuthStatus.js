import { useEffect, useState } from 'react'
import { isAuthenticated } from '../api/auth'

// Returns null while checking, then true/false. Re-checks whenever `key` changes.
export function useAuthStatus(key) {
  const [loggedIn, setLoggedIn] = useState(null)

  useEffect(() => {
    setLoggedIn(null)
    isAuthenticated().then(setLoggedIn)
  }, [key])

  return loggedIn
}
