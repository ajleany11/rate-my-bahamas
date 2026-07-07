import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const access = params.get('access')
    const refresh = params.get('refresh')

    if (access && refresh) {
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      navigate('/', { replace: true })
    } else {
      navigate('/login?error=google_failed', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500">Signing you in...</p>
    </div>
  )
}

export default AuthCallback
