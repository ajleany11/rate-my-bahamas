import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { verifyEmail, verifyPasswordReset } from '../api/auth'

function VerifyCode() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, purpose } = location.state || {}

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!email || !purpose) {
    return <Navigate to="/signup" replace />
  }

  const isSignup = purpose === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) {
        await verifyEmail({ email, code })
        navigate('/login')
      } else {
        const data = await verifyPasswordReset({ email, code })
        navigate('/reset-password', { state: { resetToken: data.reset_token } })
      }
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
            KNOW BEFORE <span className="text-amber-500">YOU GO</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>
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
                htmlFor="code"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-lg tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 transition-colors"
            >
              {submitting ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isSignup ? (
            <>
              Already verified?{' '}
              <Link to="/login" className="font-medium text-blue-900 hover:text-blue-700">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Didn&apos;t get a code?{' '}
              <Link to="/forgot-password" className="font-medium text-blue-900 hover:text-blue-700">
                Try again
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default VerifyCode
