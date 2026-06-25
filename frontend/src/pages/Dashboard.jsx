import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

function Dashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <h1 className="text-xl font-serif font-bold text-blue-900 mb-2">
          You&apos;re signed in
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Welcome to Rate My Bahamas.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg py-2.5 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Dashboard
