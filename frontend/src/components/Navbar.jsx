import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import Logo from './Logo'
import SearchBar from './SearchBar'

function Navbar({ showSearch = true }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="font-serif font-bold text-blue-900 text-lg leading-none whitespace-nowrap">
            KNOW BEFORE YOU GO <span className="text-amber-500">BAHAMAS</span>
          </span>
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <SearchBar />
          </div>
        )}

        <div className="hidden sm:flex items-center gap-3 ml-auto">
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

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="sm:hidden ml-auto w-9 h-9 flex items-center justify-center text-blue-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 px-4 py-3 space-y-3">
          {showSearch && <SearchBar />}
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block text-sm font-medium text-slate-600 hover:text-blue-900"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block text-sm font-medium text-slate-600 hover:text-blue-900"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
