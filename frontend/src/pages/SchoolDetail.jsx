import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSchoolDetail } from '../api/schools'

function DepartmentIcon() {
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

function SchoolDetail() {
  const { slug } = useParams()
  const [school, setSchool] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setSchool(null)
    setError(null)
    getSchoolDetail(slug)
      .then(setSchool)
      .catch(() => setError('Failed to load this school.'))
  }, [slug])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}

        {!error && !school && <p className="text-slate-500">Loading...</p>}

        {school && (
          <>
            <h1 className="text-3xl font-serif font-bold text-blue-900">{school.name}</h1>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Departments
            </h2>
            {school.departments.length === 0 ? (
              <p className="mt-2 text-slate-500">No departments yet.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {school.departments.map((department) => (
                  <div
                    key={department.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <DepartmentIcon />
                    </div>
                    <h3 className="mt-4 font-serif font-bold text-blue-900">{department.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default SchoolDetail
