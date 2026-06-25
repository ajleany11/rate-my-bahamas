function SearchBar({ placeholder = 'Search for a professor...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
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
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
      />
    </div>
  )
}

export default SearchBar
