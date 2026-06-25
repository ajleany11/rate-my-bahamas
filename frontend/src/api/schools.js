const API_BASE_URL = 'http://localhost:8000'

export async function getSchools() {
  const res = await fetch(`${API_BASE_URL}/api/schools/`)
  if (!res.ok) {
    throw new Error('Failed to load schools.')
  }
  return res.json()
}

export async function getSchoolDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/api/schools/${slug}/`)
  if (!res.ok) {
    throw new Error('Failed to load school.')
  }
  return res.json()
}
