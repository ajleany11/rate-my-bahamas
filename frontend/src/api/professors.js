const API_BASE_URL = 'http://localhost:8000'

export async function getProfessorDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/api/professors/${slug}/`)
  if (!res.ok) {
    throw new Error('Failed to load this professor.')
  }
  return res.json()
}
