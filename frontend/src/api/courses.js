import { authFetch } from './auth'

const API_BASE_URL = ''

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

export async function assignCourseSchool(courseId, schoolSlug) {
  const res = await authFetch(`/api/courses/${courseId}/assign-school/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ school_slug: schoolSlug }),
  })
  if (!res.ok) {
    throw new Error('Failed to assign school.')
  }
  return res.json()
}
