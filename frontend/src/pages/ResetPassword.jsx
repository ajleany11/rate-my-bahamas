import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { confirmPasswordReset } from '../api/auth'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetToken } = location.state || {}

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!resetToken) {
    return <Navigate to="/forgot-password" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await confirmPasswordReset({ resetToken, newPassword: password, newPassword2: confirmPassword })
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-blue-900 text-center">
            KNOW BEFORE YOU GO <span className="text-amber-500">BAHAMAS</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Choose a new password for your account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 transition-colors"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="font-medium text-blue-900 hover:text-blue-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
