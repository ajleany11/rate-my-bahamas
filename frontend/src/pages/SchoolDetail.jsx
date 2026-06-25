import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSchoolDetail } from '../api/schools'

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

      <section className="max-w-3xl mx-auto px-4 py-12">
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
              <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
                {school.departments.map((department) => (
                  <li key={department.id} className="px-4 py-3 text-slate-700">
                    {department.name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default SchoolDetail
