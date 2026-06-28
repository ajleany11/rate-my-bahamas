import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCollegeDetail } from '../api/colleges'

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
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

function CollegeDetail() {
  const { slug } = useParams()
  const [college, setCollege] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCollege(null)
    setError(null)
    getCollegeDetail(slug)
      .then(setCollege)
      .catch(() => setError('Failed to load this college.'))
  }, [slug])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}

        {!error && !college && <p className="text-slate-500">Loading...</p>}

        {college && (
          <>
            <h1 className="text-3xl font-serif font-bold text-blue-900">{college.name}</h1>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Schools
            </h2>
            {college.schools.length === 0 ? (
              <p className="mt-2 text-slate-500">No schools yet.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {college.schools.map((school) => (
                  <Link
                    key={school.id}
                    to={`/schools/${school.slug}`}
                    className="block bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <SchoolIcon />
                    </div>
                    <h3 className="mt-4 font-serif font-bold text-blue-900">{school.name}</h3>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default CollegeDetail
