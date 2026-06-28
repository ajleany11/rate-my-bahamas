import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAccessStatus } from '../hooks/useAccessStatus'
import { createCheckoutSession } from '../api/billing'

function Subscribe() {
  const { status, semester } = useAccessStatus()
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handlePay() {
    setSubmitting(true)
    setError(null)
    try {
      const data = await createCheckoutSession()
      window.location.href = data.checkout_url
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <section className="max-w-md mx-auto px-4 py-16 text-center">
        {status === 'checking' && <p className="text-slate-500">Loading...</p>}

        {status === 'guest' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h1 className="text-2xl font-serif font-bold text-blue-900">Log in first</h1>
            <p className="mt-2 text-slate-500">You need to be signed in to pay for access.</p>
            <Link
              to="/login"
              className="mt-6 inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-6 py-2.5"
            >
              Log In
            </Link>
          </div>
        )}

        {status === 'active' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h1 className="text-2xl font-serif font-bold text-blue-900">You&apos;re all set</h1>
            <p className="mt-2 text-slate-500">
              You already have access for {semester ? semester.name : 'this semester'}.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-6 py-2.5"
            >
              Go to Home
            </Link>
          </div>
        )}

        {status === 'unpaid' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h1 className="text-2xl font-serif font-bold text-blue-900">Unlock Professors &amp; Reviews</h1>
            {semester ? (
              <p className="mt-2 text-slate-500">
                ${(semester.price_cents / 100).toFixed(2)} for {semester.name} access.
              </p>
            ) : (
              <p className="mt-2 text-slate-500">No semester is available for purchase right now.</p>
            )}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {semester && (
              <button
                type="button"
                onClick={handlePay}
                disabled={submitting}
                className="mt-6 w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 transition-colors"
              >
                {submitting ? 'Redirecting...' : `Pay $${(semester.price_cents / 100).toFixed(2)}`}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Subscribe
