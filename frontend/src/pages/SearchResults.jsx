import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { search } from '../api/search'

const TABS = [
  { key: 'courses', label: 'Courses' },
  { key: 'schools', label: 'Schools' },
  { key: 'professors', label: 'Professors' },
  { key: 'colleges', label: 'Colleges' },
]

// Only these tabs have a `department` string field to filter on.
const FILTERABLE_TABS = new Set(['courses', 'professors'])

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('courses')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  useEffect(() => {
    setResults(null)
    setError(null)
    setActiveTab('courses')
    setDepartmentFilter('all')

    if (!query) return
    search(query)
      .then(setResults)
      .catch(() => setError('Search failed.'))
  }, [query])

  useEffect(() => {
    setDepartmentFilter('all')
  }, [activeTab])

  const activeItems = useMemo(() => (results ? results[activeTab] : []), [results, activeTab])

  const departmentOptions = useMemo(() => {
    if (!FILTERABLE_TABS.has(activeTab)) return []
    return [...new Set(activeItems.map((item) => item.department))].sort()
  }, [activeTab, activeItems])

  const visibleItems =
    FILTERABLE_TABS.has(activeTab) && departmentFilter !== 'all'
      ? activeItems.filter((item) => item.department === departmentFilter)
      : activeItems

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-serif font-bold text-blue-900">
          Results for &ldquo;{query}&rdquo;
        </h1>

        {error && <p className="mt-6 text-slate-500">{error}</p>}
        {!error && !results && query && <p className="mt-6 text-slate-500">Searching...</p>}

        {results && (
          <>
            <div className="mt-6 flex gap-2 border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-blue-900 text-blue-900'
                      : 'border-transparent text-slate-500 hover:text-blue-900'
                  }`}
                >
                  {tab.label} ({results[tab.key].length})
                </button>
              ))}
            </div>

            {FILTERABLE_TABS.has(activeTab) && departmentOptions.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <label htmlFor="department-filter" className="text-sm text-slate-500">
                  Department
                </label>
                <select
                  id="department-filter"
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 text-sm py-1.5 px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                >
                  <option value="all">All departments</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {activeTab === 'courses' &&
                (visibleItems.length === 0 ? (
                  <p className="text-slate-500">No courses found.</p>
                ) : (
                  visibleItems.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.code}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <p className="font-semibold text-blue-900">{course.code}</p>
                      <p className="text-slate-700">{course.name}</p>
                      <p className="text-sm text-slate-400">{course.department}</p>
                    </Link>
                  ))
                ))}

              {activeTab === 'schools' &&
                (visibleItems.length === 0 ? (
                  <p className="text-slate-500">No schools found.</p>
                ) : (
                  visibleItems.map((school) => (
                    <Link
                      key={school.id}
                      to={`/schools/${school.slug}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <p className="font-semibold text-blue-900">{school.name}</p>
                      <p className="text-sm text-slate-400">{school.college.name}</p>
                    </Link>
                  ))
                ))}

              {activeTab === 'professors' &&
                (visibleItems.length === 0 ? (
                  <p className="text-slate-500">No professors found.</p>
                ) : (
                  visibleItems.map((professor) => (
                    <Link
                      key={professor.id}
                      to={`/professors/${professor.slug}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <p className="font-semibold text-blue-900">{professor.name}</p>
                      <p className="text-sm text-slate-400">{professor.department}</p>
                    </Link>
                  ))
                ))}

              {activeTab === 'colleges' &&
                (visibleItems.length === 0 ? (
                  <p className="text-slate-500">No colleges found.</p>
                ) : (
                  visibleItems.map((college) => (
                    <Link
                      key={college.id}
                      to={`/colleges/${college.slug}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <p className="font-semibold text-blue-900">{college.name}</p>
                      <p className="text-sm text-slate-400">
                        {college.school_count}{' '}
                        {college.school_count === 1 ? 'school' : 'schools'}
                      </p>
                    </Link>
                  ))
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default SearchResults
