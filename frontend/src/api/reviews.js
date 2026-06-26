import { authFetch } from './auth'

function extractErrorMessage(data) {
  if (!data || typeof data !== 'object') return 'Something went wrong. Please try again.'
  const firstKey = Object.keys(data)[0]
  if (!firstKey) return 'Something went wrong. Please try again.'
  const value = data[firstKey]
  return Array.isArray(value) ? value[0] : String(value)
}

export async function createReview({ professor, course, rating, difficulty, wouldTakeAgain, usesTextbook, comment }) {
  const res = await authFetch('/api/reviews/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      professor,
      course,
      rating,
      difficulty,
      would_take_again: wouldTakeAgain,
      uses_textbook: usesTextbook,
      comment,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data
}
