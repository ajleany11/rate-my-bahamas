const API_BASE_URL = 'http://localhost:8000'

export async function getColleges() {
  const res = await fetch(`${API_BASE_URL}/api/colleges/`)
  if (!res.ok) {
    throw new Error('Failed to load colleges.')
  }
  return res.json()
}

export async function getCollegeDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/api/colleges/${slug}/`)
  if (!res.ok) {
    throw new Error('Failed to load college.')
  }
  return res.json()
}

export async function getAllSchools() {
  const res = await fetch(`${API_BASE_URL}/api/colleges/schools/`)
  if (!res.ok) {
    throw new Error('Failed to load schools.')
  }
  return res.json()
}

export async function getSchoolDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/api/colleges/schools/${slug}/`)
  if (!res.ok) {
    throw new Error('Failed to load school.')
  }
  return res.json()
}
