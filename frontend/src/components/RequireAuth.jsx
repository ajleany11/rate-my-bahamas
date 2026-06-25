import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../api/auth'

function RequireAuth({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    isAuthenticated().then((ok) => setStatus(ok ? 'authenticated' : 'unauthenticated'))
  }, [])

  if (status === 'checking') return null
  return status === 'authenticated' ? children : <Navigate to="/login" replace />
}

export default RequireAuth
