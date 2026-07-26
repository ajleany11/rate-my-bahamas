import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import EditReviewModal from '../components/EditReviewModal'
import { deleteReview, getMyReviews } from '../api/reviews'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function MyRatings() {
  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    getMyReviews()
      .then(setReviews)
      .catch(() => setError('Failed to load your ratings.'))
  }, [])

  function handleSaved(updated) {
    setReviews((current) => current.map((r) => (r.id === updated.id ? updated : r)))
    setEditingReview(null)
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(
      `Delete your rating for ${review.professor.name} (${review.course.code})? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleteError(null)
    setDeletingId(review.id)
    try {
      await deleteReview(review.id)
      setReviews((current) => current.filter((r) => r.id !== review.id))
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-serif font-bold text-blue-900">My Ratings</h1>
        <p className="mt-1 text-sm text-slate-500">Ratings you&apos;ve submitted. You can edit any of them below.</p>

        {error && <p className="mt-6 text-slate-500">{error}</p>}
        {deleteError && <p className="mt-6 text-red-600 text-sm">{deleteError}</p>}
        {!error && !reviews && <p className="mt-6 text-slate-500">Loading...</p>}
        {reviews && reviews.length === 0 && (
          <p className="mt-6 text-slate-500">You haven&apos;t rated any professors yet.</p>
        )}

        {reviews && reviews.length > 0 && (
          <div className="mt-6 space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/professors/${review.professor.slug}`}
                      className="font-semibold text-blue-900 hover:underline"
                    >
                      {review.professor.name}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {review.course.code} - {review.course.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">{formatDate(review.created_at)}</p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span>
                    <span className="font-bold text-blue-900">{review.rating}</span>
                    <span className="text-slate-400">/5 quality</span>
                  </span>
                  <span>
                    <span className="font-bold text-blue-900">{review.difficulty}</span>
                    <span className="text-slate-400">/5 difficulty</span>
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>{review.would_take_again ? 'Would take again' : 'Would not take again'}</span>
                  <span>{review.uses_textbook ? 'Used a textbook' : 'No textbook used'}</span>
                </div>

                {review.comment && <p className="mt-3 text-slate-700">{review.comment}</p>}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReview(review)}
                    className="text-sm font-semibold text-amber-600 border border-amber-200 rounded-full px-4 py-1.5 hover:bg-amber-50"
                  >
                    Edit Rating
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    disabled={deletingId === review.id}
                    className="text-sm font-semibold text-red-600 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === review.id ? 'Deleting...' : 'Delete Rating'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default MyRatings
