import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSchools } from '../api/schools'

function SchoolsDropdown({ stacked = false }) {
  const [isOpen, setIsOpen] = useState(stacked)
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
    if (stacked) return

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [stacked])

  const menu = (
    <>
      {error && <p className="px-4 py-2 text-sm text-slate-400">{error}</p>}
      {!error && schools.length === 0 && (
        <p className="px-4 py-2 text-sm text-slate-400">No schools yet.</p>
      )}
      {!error &&
        schools.map((school) => (
          <Link
            key={school.id}
            to={`/schools/${school.slug}`}
            onClick={() => setIsOpen(stacked)}
            className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-900"
          >
            <span>{school.name}</span>
            <span className="text-xs text-slate-400">{school.department_count} depts</span>
          </Link>
        ))}
      <Link
        to="/schools"
        onClick={() => setIsOpen(stacked)}
        className="block px-4 py-2 text-sm font-medium text-blue-900 hover:bg-slate-50 border-t border-slate-100"
      >
        View all schools
      </Link>
    </>
  )

  if (stacked) {
    return <div className="rounded-lg border border-slate-100 divide-y divide-slate-100">{menu}</div>
  }

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
          {menu}
        </div>
      )}
    </div>
  )
}

export default SchoolsDropdown
