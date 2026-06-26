const API_BASE_URL = 'http://localhost:8000'

export async function getCourseDetail(code) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${code}/`)
  if (!res.ok) {
    throw new Error('Failed to load this course.')
  }
  return res.json()
}

export async function getSimilarCourses(code) {
  const res = await fetch(`${API_BASE_URL}/api/courses/${code}/similar/`)
  if (!res.ok) {
    throw new Error('Failed to load similar courses.')
  }
  return res.json()
}
