import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ placeholder = 'Search courses, professors, schools...', className = '', size = 'sm' }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const isLarge = size === 'lg'

  function handleSubmit(event) {
    event.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      {!isLarge && (
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
      )}
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={
          isLarge
            ? 'w-full rounded-full border border-slate-200 pl-5 pr-14 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
            : 'w-full rounded-full border border-slate-300 pl-9 pr-4 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900'
        }
      />
      {isLarge && (
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
        </button>
      )}
    </form>
  )
}

export default SearchBar
