import { Link } from 'react-router-dom'

function LoginPrompt({ message = 'Log in to see this.', to = '/login', ctaLabel = 'Log In' }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
      <p className="text-slate-700">{message}</p>
      <Link
        to={to}
        className="mt-3 inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-5 py-2 text-sm transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

export default LoginPrompt
