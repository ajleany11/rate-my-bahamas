import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { search } from '../api/search'

const TABS = [
  { key: 'courses', label: 'Courses' },
  { key: 'professors', label: 'Professors' },
  { key: 'schools', label: 'Schools' },
]

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('courses')

  useEffect(() => {
    setResults(null)
    setError(null)
    setActiveTab('courses')

    if (!query) return
    search(query)
      .then(setResults)
      .catch(() => setError('Search failed.'))
  }, [query])

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

            <div className="mt-6 space-y-3">
              {activeTab === 'courses' &&
                (results.courses.length === 0 ? (
                  <p className="text-slate-500">No courses found.</p>
                ) : (
                  results.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                    >
                      <p className="font-semibold text-blue-900">{course.code}</p>
                      <p className="text-slate-700">{course.name}</p>
                      <p className="text-sm text-slate-400">{course.department}</p>
                    </div>
                  ))
                ))}

              {activeTab === 'professors' &&
                (results.professors.length === 0 ? (
                  <p className="text-slate-500">No professors found.</p>
                ) : (
                  results.professors.map((professor) => (
                    <div
                      key={professor.id}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                    >
                      <p className="font-semibold text-blue-900">{professor.name}</p>
                      <p className="text-sm text-slate-400">{professor.department}</p>
                    </div>
                  ))
                ))}

              {activeTab === 'schools' &&
                (results.schools.length === 0 ? (
                  <p className="text-slate-500">No schools found.</p>
                ) : (
                  results.schools.map((school) => (
                    <Link
                      key={school.id}
                      to={`/schools/${school.slug}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <p className="font-semibold text-blue-900">{school.name}</p>
                      <p className="text-sm text-slate-400">
                        {school.department_count}{' '}
                        {school.department_count === 1 ? 'department' : 'departments'}
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
