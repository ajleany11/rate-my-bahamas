import { authFetch } from './auth'

const API_BASE_URL = 'http://localhost:8000'

function extractErrorMessage(data) {
  if (!data || typeof data !== 'object') return 'Something went wrong. Please try again.'
  const firstKey = Object.keys(data)[0]
  if (!firstKey) return 'Something went wrong. Please try again.'
  const value = data[firstKey]
  return Array.isArray(value) ? value[0] : String(value)
}

export async function getAllProfessors() {
  const res = await fetch(`${API_BASE_URL}/api/professors/`)
  if (!res.ok) {
    throw new Error('Failed to load professors.')
  }
  return res.json()
}

export async function getTopRatedProfessors() {
  const res = await authFetch('/api/professors/top-rated/')
  if (!res.ok) {
    throw new Error('Failed to load top rated professors.')
  }
  return res.json()
}

export async function getProfessorDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/api/professors/${slug}/`)
  if (!res.ok) {
    throw new Error('Failed to load this professor.')
  }
  return res.json()
}

export async function getProfessorCourseDetail(id) {
  const res = await fetch(`${API_BASE_URL}/api/professor-course/${id}/`)
  if (!res.ok) {
    throw new Error('Failed to load reviews.')
  }
  return res.json()
}

export async function addProfessorToCourse({ professor, professorName, course }) {
  const res = await authFetch('/api/professor-course/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      course,
      ...(professorName ? { professor_name: professorName } : { professor }),
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(extractErrorMessage(data))
  }
  return data
}
