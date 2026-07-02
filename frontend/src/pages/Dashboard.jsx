import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { useAccessStatus } from '../hooks/useAccessStatus'

function Dashboard() {
  const navigate = useNavigate()
  const { onTrial, trialDaysRemaining } = useAccessStatus()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        {onTrial && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
            <p className="text-sm font-semibold text-amber-700">
              {trialDaysRemaining === 1
                ? 'Your free trial expires in 1 day.'
                : `Your free trial expires in ${trialDaysRemaining} days.`}
            </p>
            <Link
              to="/subscribe"
              className="mt-2 inline-block text-sm font-semibold text-blue-900 hover:underline"
            >
              Subscribe to keep access →
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <h1 className="text-xl font-serif font-bold text-blue-900 mb-2">
            You&apos;re signed in
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Welcome to KnowBeforeYouGo.
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
    </div>
  )
}

export default Dashboard
