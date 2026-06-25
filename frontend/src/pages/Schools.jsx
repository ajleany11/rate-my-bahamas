import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSchools } from '../api/schools'

function SchoolIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 4l9 5.5-9 5.5-9-5.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v5c0 1 2.5 2 5 2s5-1 5-2v-5" />
    </svg>
  )
}

function Schools() {
  const [schools, setSchools] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSchools()
      .then(setSchools)
      .catch(() => setError('Failed to load schools.'))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-blue-900">Schools</h1>
        <p className="text-slate-500 mt-1">Browse departments by school.</p>

        {error && <p className="mt-6 text-slate-500">{error}</p>}
        {!error && !schools && <p className="mt-6 text-slate-500">Loading...</p>}
        {!error && schools && schools.length === 0 && (
          <p className="mt-6 text-slate-500">No schools yet.</p>
        )}

        {!error && schools && schools.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <Link
                key={school.id}
                to={`/schools/${school.slug}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-blue-100 transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                  <SchoolIcon />
                </div>
                <h2 className="mt-4 font-serif font-bold text-blue-900">{school.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {school.department_count} {school.department_count === 1 ? 'department' : 'departments'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Schools
