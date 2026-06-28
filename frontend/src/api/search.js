const API_BASE_URL = ''

export async function search(query) {
  const res = await fetch(`${API_BASE_URL}/api/search/?q=${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Search failed.')
  }
  return res.json()
}

export async function getAutocompleteSuggestions(query) {
  const res = await fetch(`${API_BASE_URL}/api/search/autocomplete/?q=${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Autocomplete failed.')
  }
  return res.json()
}
