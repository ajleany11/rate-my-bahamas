import { useState } from 'react'
import { createReview } from '../api/reviews'

const SCALE = [1, 2, 3, 4, 5]

function ScalePicker({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex gap-2">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-full border text-sm font-semibold transition-colors ${
              value === n
                ? 'bg-blue-900 border-blue-900 text-white'
                : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function YesNoToggle({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
            value === true
              ? 'bg-blue-900 border-blue-900 text-white'
              : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
            value === false
              ? 'bg-blue-900 border-blue-900 text-white'
              : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}

function WriteReviewModal({ professor, course, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [wouldTakeAgain, setWouldTakeAgain] = useState(null)
  const [usesTextbook, setUsesTextbook] = useState(null)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!rating || !difficulty || wouldTakeAgain === null || usesTextbook === null) {
      setError('Please fill in rating, difficulty, would-take-again, and textbook use.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const review = await createReview({
        professor: professor.id,
        course: course.id,
        rating,
        difficulty,
        wouldTakeAgain,
        usesTextbook,
        comment,
      })
      onSubmitted(review)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-blue-900">Rate {professor.name}</h2>
            <p className="text-sm text-slate-500">
              {course.code} - {course.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <ScalePicker label="Quality Rating (1 = poor, 5 = excellent)" value={rating} onChange={setRating} />
          <ScalePicker label="Difficulty (1 = easy, 5 = hard)" value={difficulty} onChange={setDifficulty} />

          <YesNoToggle
            label="Would you take this professor again?"
            value={wouldTakeAgain}
            onChange={setWouldTakeAgain}
          />

          <YesNoToggle
            label="Did this professor use textbooks?"
            value={usesTextbook}
            onChange={setUsesTextbook}
          />

          <div>
            <label htmlFor="review-comment" className="text-sm font-semibold text-slate-700">
              Comment (optional)
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder="Share your experience with this professor..."
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WriteReviewModal
