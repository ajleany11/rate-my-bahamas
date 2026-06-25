import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-serif text-sm font-bold">
            UB
          </div>
          <span className="font-serif font-bold text-blue-900 text-lg leading-none whitespace-nowrap">
            RATE MY <span className="text-amber-500">BAHAMAS</span>
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search for a professor..."
              className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/dashboard"
            aria-label="Profile"
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 hover:text-blue-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
