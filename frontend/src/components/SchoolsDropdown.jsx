import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSchools } from '../api/schools'

function SchoolsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [schools, setSchools] = useState([])
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    getSchools()
      .then(setSchools)
      .catch(() => setError('Failed to load schools.'))
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-900"
      >
        Schools
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border border-slate-100 bg-white shadow-lg py-1 z-10">
          {error && <p className="px-4 py-2 text-sm text-slate-400">{error}</p>}
          {!error && schools.length === 0 && (
            <p className="px-4 py-2 text-sm text-slate-400">No schools yet.</p>
          )}
          {!error &&
            schools.map((school) => (
              <Link
                key={school.id}
                to={`/schools/${school.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-900"
              >
                {school.name}
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}

export default SchoolsDropdown
