import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getDepartmentDetail } from '../api/schools'

function DepartmentDetail() {
  const { slug } = useParams()
  const [department, setDepartment] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setDepartment(null)
    setError(null)
    getDepartmentDetail(slug)
      .then(setDepartment)
      .catch(() => setError('Failed to load this department.'))
  }, [slug])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}
        {!error && !department && <p className="text-slate-500">Loading...</p>}

        {department && (
          <>
            <Link to={`/schools/${department.school.slug}`} className="text-sm text-amber-600 hover:underline">
              {department.school.name}
            </Link>
            <h1 className="mt-1 text-3xl font-serif font-bold text-blue-900">{department.name}</h1>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Courses ({department.courses.length})
            </h2>

            {department.courses.length === 0 ? (
              <p className="mt-2 text-slate-500">No courses listed yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {department.courses.map((course) => (
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

export default DepartmentDetail
