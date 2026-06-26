import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAutocompleteSuggestions } from '../api/search'

const TYPE_LABELS = {
  course: 'Course',
  professor: 'Professor',
  department: 'Department',
  school: 'School',
}

function SearchBar({ placeholder = 'Search courses, professors, schools...', className = '', size = 'sm' }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const isLarge = size === 'lg'

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(() => {
      getAutocompleteSuggestions(trimmed)
        .then((data) => {
          setSuggestions(data.suggestions)
          setIsOpen(data.suggestions.length > 0)
          setActiveIndex(-1)
        })
        .catch(() => {})
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function goToResults(term) {
    setIsOpen(false)
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  function goToSuggestion(suggestion) {
    setIsOpen(false)
    if (suggestion.type === 'course') {
      navigate(`/courses/${encodeURIComponent(suggestion.query)}`)
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.query)}`)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToSuggestion(suggestions[activeIndex])
      return
    }
    if (!query.trim()) return
    goToResults(query.trim())
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion.query)
    goToSuggestion(suggestion)
  }

  function handleKeyDown(event) {
    if (!isOpen || suggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
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
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(suggestions.length > 0)}
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

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-slate-100 bg-white shadow-lg py-1 z-20 text-left">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.label}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm text-left ${
                index === activeIndex ? 'bg-slate-50 text-blue-900' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
              }`}
            >
              <span>{suggestion.label}</span>
              <span className="text-xs text-slate-400">{TYPE_LABELS[suggestion.type]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
