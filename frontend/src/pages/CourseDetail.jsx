import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCourseDetail } from '../api/courses'

function CourseDetail() {
  const { code } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCourse(null)
    setError(null)
    getCourseDetail(code)
      .then(setCourse)
      .catch(() => setError('Failed to load this course.'))
  }, [code])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}
        {!error && !course && <p className="text-slate-500">Loading...</p>}

        {course && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <p className="text-sm font-semibold text-amber-600">{course.code}</p>
            <h1 className="mt-1 text-3xl font-serif font-bold text-blue-900">{course.name}</h1>
            <p className="mt-2 text-slate-500">{course.department}</p>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Description
            </h2>
            <p className="mt-2 text-slate-700">
              {course.description || 'No description available yet.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default CourseDetail
