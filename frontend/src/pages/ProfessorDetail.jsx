import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProfessorDetail } from '../api/professors'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ProfessorDetail() {
  const { slug } = useParams()
  const [professor, setProfessor] = useState(null)
  const [error, setError] = useState(null)
  const [activeDepartment, setActiveDepartment] = useState('all')

  useEffect(() => {
    setProfessor(null)
    setError(null)
    setActiveDepartment('all')
    getProfessorDetail(slug)
      .then(setProfessor)
      .catch(() => setError('Failed to load this professor.'))
  }, [slug])

  const departmentTabs = useMemo(() => {
    if (!professor) return []
    return [...new Set(professor.courses_taught.map((c) => c.course.department))].sort()
  }, [professor])

  const visibleCourses = useMemo(() => {
    if (!professor) return []
    if (activeDepartment === 'all') return professor.courses_taught
    return professor.courses_taught.filter((c) => c.course.department === activeDepartment)
  }, [professor, activeDepartment])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}
        {!error && !professor && <p className="text-slate-500">Loading...</p>}

        {professor && (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center text-lg">
                    {initials(professor.name)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-blue-900">{professor.name}</h1>
                    <p className="mt-1 text-slate-500">{professor.department}</p>
                  </div>
                </div>
                {professor.overall_average_rating !== null && (
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold text-blue-900">
                      {professor.overall_average_rating}
                      <span className="text-base font-normal text-slate-400">/5</span>
                    </p>
                    <p className="text-xs text-slate-400">overall rating</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                {professor.overall_would_take_again_percent !== null && (
                  <span>
                    <span className="font-semibold text-blue-900">
                      {professor.overall_would_take_again_percent}%
                    </span>{' '}
                    would take again
                  </span>
                )}
                <span>
                  {professor.overall_review_count}{' '}
                  {professor.overall_review_count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Courses Taught
            </h2>

            {professor.courses_taught.length === 0 ? (
              <p className="mt-2 text-slate-500">No courses listed for this professor yet.</p>
            ) : (
              <>
                <div className="mt-3 flex gap-2 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveDepartment('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeDepartment === 'all'
                        ? 'border-blue-900 text-blue-900'
                        : 'border-transparent text-slate-500 hover:text-blue-900'
                    }`}
                  >
                    All ({professor.courses_taught.length})
                  </button>
                  {departmentTabs.map((department) => (
                    <button
                      key={department}
                      type="button"
                      onClick={() => setActiveDepartment(department)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                        activeDepartment === department
                          ? 'border-blue-900 text-blue-900'
                          : 'border-transparent text-slate-500 hover:text-blue-900'
                      }`}
                    >
                      {department} (
                      {professor.courses_taught.filter((c) => c.course.department === department).length})
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {visibleCourses.map((courseTaught) => (
                    <div
                      key={courseTaught.id}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link to={`/courses/${courseTaught.course.code}`} className="font-semibold text-blue-900 hover:underline">
                              {courseTaught.course.code}
                            </Link>
                            {!courseTaught.confirmed && (
                              <span
                                title="Added by a user — not yet confirmed by our team"
                                className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 rounded-full px-2 py-0.5"
                              >
                                Unconfirmed
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700">{courseTaught.course.name}</p>
                        </div>
                        {courseTaught.average_rating !== null && (
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-blue-900">
                              {courseTaught.average_rating}
                              <span className="text-sm font-normal text-slate-400">/5</span>
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                        {courseTaught.would_take_again_percent !== null && (
                          <span>
                            <span className="font-semibold text-blue-900">
                              {courseTaught.would_take_again_percent}%
                            </span>{' '}
                            would take again
                          </span>
                        )}
                        <Link to={`/professor-course/${courseTaught.id}`} className="hover:underline">
                          {courseTaught.review_count}{' '}
                          {courseTaught.review_count === 1 ? 'review' : 'reviews'}
                        </Link>
                      </div>

                      {courseTaught.reviews.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          {courseTaught.reviews.map((review) => (
                            <div key={review.id} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 text-sm">
                                  <span>
                                    <span className="font-bold text-blue-900">{review.rating}</span>
                                    <span className="text-slate-400">/5 quality</span>
                                  </span>
                                  <span>
                                    <span className="font-bold text-blue-900">{review.difficulty}</span>
                                    <span className="text-slate-400">/5 difficulty</span>
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 shrink-0">{formatDate(review.created_at)}</p>
                              </div>
                              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                <span>{review.would_take_again ? 'Would take again' : 'Would not take again'}</span>
                                <span>{review.uses_textbook ? 'Used a textbook' : 'No textbook used'}</span>
                              </div>
                              {review.comment && <p className="mt-2 text-sm text-slate-700">{review.comment}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default ProfessorDetail
