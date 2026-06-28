import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPaymentStatus } from '../api/billing'

const MAX_ATTEMPTS = 5
const POLL_DELAY_MS = 1500

function SubscribeSuccess() {
  const [checking, setChecking] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    async function poll() {
      try {
        const data = await getPaymentStatus()
        if (data.has_access) {
          if (!cancelled) {
            setConfirmed(true)
            setChecking(false)
          }
          return
        }
      } catch {
        // ignore and retry
      }
      attempts += 1
      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled) setChecking(false)
        return
      }
      setTimeout(poll, POLL_DELAY_MS)
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <section className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {checking && <p className="text-slate-500">Confirming your payment...</p>}

          {!checking && confirmed && (
            <>
              <h1 className="text-2xl font-serif font-bold text-blue-900">Payment confirmed!</h1>
              <p className="mt-2 text-slate-500">You now have access to professors and reviews.</p>
            </>
          )}

          {!checking && !confirmed && (
            <>
              <h1 className="text-2xl font-serif font-bold text-blue-900">Thanks!</h1>
              <p className="mt-2 text-slate-500">
                Your payment is processing. It may take a moment to activate — check back shortly.
              </p>
            </>
          )}

          <Link
            to="/"
            className="mt-6 inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-6 py-2.5"
          >
            Go to Home
          </Link>
        </div>
      </section>
    </div>
  )
}

export default SubscribeSuccess
