import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSchoolDetail } from '../api/colleges'

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
            {school.college && (
              <Link to={`/colleges/${school.college.slug}`} className="text-sm text-amber-600 hover:underline">
                {school.college.name}
              </Link>
            )}
            <h1 className={`${school.college ? 'mt-1' : ''} text-3xl font-serif font-bold text-blue-900`}>{school.name}</h1>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Courses ({school.courses.length})
            </h2>

            {school.courses.length === 0 ? (
              <p className="mt-2 text-slate-500">No courses listed yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {school.courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.code}`}
                    className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                  >
                    <p className="font-semibold text-blue-900">{course.code}</p>
                    <p className="text-slate-700">{course.name}</p>
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

export default SchoolDetail
