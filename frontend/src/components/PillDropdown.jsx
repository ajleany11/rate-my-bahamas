import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function PillDropdown({
  label,
  loadItems,
  getItemKey,
  getItemLink,
  getItemLabel,
  getItemSublabel,
  viewAllTo,
  viewAllLabel,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen || items.length > 0) return
    loadItems()
      .then(setItems)
      .catch(() => setError('Failed to load.'))
  }, [isOpen, items.length, loadItems])

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
        className="flex items-center gap-1.5 rounded-full border border-blue-200 text-blue-900 text-sm font-medium px-4 py-1.5 hover:bg-blue-50 transition-colors"
      >
        {label}
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
        <div className="absolute left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-lg border border-slate-100 bg-white shadow-lg py-1 z-20 text-left">
          {error && <p className="px-4 py-2 text-sm text-slate-400">{error}</p>}
          {!error && items.length === 0 && (
            <p className="px-4 py-2 text-sm text-slate-400">Loading...</p>
          )}
          {!error &&
            items.map((item) => (
              <Link
                key={getItemKey(item)}
                to={getItemLink(item)}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-900"
              >
                <span>{getItemLabel(item)}</span>
                {getItemSublabel && <span className="block text-xs text-slate-400">{getItemSublabel(item)}</span>}
              </Link>
            ))}
          {viewAllTo && (
            <Link
              to={viewAllTo}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-blue-900 hover:bg-slate-50 border-t border-slate-100"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PillDropdown
