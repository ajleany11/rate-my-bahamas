import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCourseDetail, getSimilarCourses } from '../api/courses'

function CourseDetail() {
  const { code } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [similarCourses, setSimilarCourses] = useState([])

  useEffect(() => {
    setCourse(null)
    setError(null)
    setSimilarCourses([])
    getCourseDetail(code)
      .then(setCourse)
      .catch(() => setError('Failed to load this course.'))
    getSimilarCourses(code)
      .then(setSimilarCourses)
      .catch(() => {})
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

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Professors
            </h2>
            {course.professors.length === 0 ? (
              <p className="mt-2 text-slate-500">No professors listed for this course yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {course.professors.map((professorCourse) => (
                  <div
                    key={professorCourse.id}
                    className="bg-slate-50 rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/professors/${professorCourse.professor.slug}`}
                          className="font-semibold text-blue-900 hover:underline"
                        >
                          {professorCourse.professor.name}
                        </Link>
                        <p className="text-sm text-slate-400">{professorCourse.professor.department}</p>
                      </div>
                      {professorCourse.average_rating !== null && (
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-blue-900">
                            {professorCourse.average_rating}
                            <span className="text-sm font-normal text-slate-400">/5</span>
                          </p>
                          <p className="text-xs text-slate-400">for {course.code}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {professorCourse.would_take_again_percent !== null && (
                          <span>
                            <span className="font-semibold text-blue-900">
                              {professorCourse.would_take_again_percent}%
                            </span>{' '}
                            would take again
                          </span>
                        )}
                        <span>
                          {professorCourse.review_count}{' '}
                          {professorCourse.review_count === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-sm font-semibold text-amber-600 border border-amber-200 rounded-full px-4 py-1.5 hover:bg-amber-50"
                      >
                        Rate this Professor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {similarCourses.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Similar Courses
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similarCourses.map((similar) => (
                <Link
                  key={similar.id}
                  to={`/courses/${similar.code}`}
                  className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                >
                  <p className="font-semibold text-blue-900">{similar.code}</p>
                  <p className="text-slate-700">{similar.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default CourseDetail
