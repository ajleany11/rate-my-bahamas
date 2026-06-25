import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import SchoolsDropdown from './SchoolsDropdown'
import SearchBar from './SearchBar'

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

        <SchoolsDropdown />

        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <SearchBar />
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
