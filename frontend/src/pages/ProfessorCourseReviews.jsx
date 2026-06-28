import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LoginPrompt from '../components/LoginPrompt'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { getProfessorCourseDetail } from '../api/professors'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function ProfessorCourseReviews() {
  const { id } = useParams()
  const loggedIn = useAuthStatus()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loggedIn) return
    setData(null)
    setError(null)
    getProfessorCourseDetail(id)
      .then(setData)
      .catch(() => setError('Failed to load reviews.'))
  }, [id, loggedIn])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {loggedIn === false && <LoginPrompt message="Log in to see these reviews." />}

        {loggedIn && error && <p className="text-slate-500">{error}</p>}
        {loggedIn && !error && !data && <p className="text-slate-500">Loading...</p>}

        {loggedIn && data && (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link to={`/professors/${data.professor.slug}`} className="text-lg font-semibold text-blue-900 hover:underline">
                    {data.professor.name}
                  </Link>
                  <p className="text-slate-500">
                    <Link to={`/courses/${data.course.code}`} className="hover:underline">
                      {data.course.code} - {data.course.name}
                    </Link>
                  </p>
                </div>
                {data.average_rating !== null && (
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold text-blue-900">
                      {data.average_rating}
                      <span className="text-base font-normal text-slate-400">/5</span>
                    </p>
                    <p className="text-xs text-slate-400">average rating</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                {data.would_take_again_percent !== null && (
                  <span>
                    <span className="font-semibold text-blue-900">{data.would_take_again_percent}%</span>{' '}
                    would take again
                  </span>
                )}
                <span>
                  {data.review_count} {data.review_count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Reviews
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Reviews are anonymous — no reviewer information is shown.
            </p>

            {data.reviews.length === 0 ? (
              <p className="mt-2 text-slate-500">No reviews yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {data.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm">
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

                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>{review.would_take_again ? 'Would take again' : 'Would not take again'}</span>
                      <span>{review.uses_textbook ? 'Used a textbook' : 'No textbook used'}</span>
                    </div>

                    {review.comment && (
                      <p className="mt-3 text-slate-700">{review.comment}</p>
                    )}
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

export default ProfessorCourseReviews
