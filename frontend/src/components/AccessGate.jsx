import { Link } from 'react-router-dom'
import LoginPrompt from './LoginPrompt'

function AccessGate({ status, semester, message }) {
  if (status === 'checking') {
    return null
  }

  if (status === 'guest') {
    return <LoginPrompt message={message} />
  }

  const price = semester ? `$${(semester.price_cents / 100).toFixed(2)}` : null
  const semesterName = semester ? semester.name : null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
      <p className="text-slate-700 font-medium">
        {price && semesterName
          ? `Subscribe for ${price} to unlock content for ${semesterName}.`
          : 'Subscribe to unlock this content.'}
      </p>
      <Link
        to="/subscribe"
        className="mt-3 inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg px-5 py-2 text-sm transition-colors"
      >
        Pay &amp; Unlock
      </Link>
    </div>
  )
}

export default AccessGate
