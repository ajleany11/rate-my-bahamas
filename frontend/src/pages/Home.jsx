import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import LoginPrompt from '../components/LoginPrompt'
import PillDropdown from '../components/PillDropdown'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { getTopRatedProfessors } from '../api/professors'
import { getAllSchools, getColleges } from '../api/colleges'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Home() {
  const loggedIn = useAuthStatus()
  const [topProfessors, setTopProfessors] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loggedIn) return
    getTopRatedProfessors()
      .then(setTopProfessors)
      .catch(() => setError('Failed to load top rated professors.'))
  }, [loggedIn])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <section className="px-4 py-20 bg-gradient-to-b from-blue-50 to-slate-50 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-blue-900 leading-tight">
          Rate Professors.
          <br />
          <span className="text-amber-500">Help Students.</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-md mx-auto">
          Real reviews from real students at The University of The Bahamas.
        </p>

        <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <SearchBar size="lg" />

          <div className="mt-4 flex items-center justify-center gap-3">
            <PillDropdown
              label="Colleges"
              loadItems={getColleges}
              getItemKey={(college) => college.id}
              getItemLink={(college) => `/colleges/${college.slug}`}
              getItemLabel={(college) => college.name}
              getItemSublabel={(college) =>
                `${college.school_count} ${college.school_count === 1 ? 'school' : 'schools'}`
              }
              viewAllTo="/colleges"
              viewAllLabel="View all colleges"
            />
            <PillDropdown
              label="Schools"
              loadItems={getAllSchools}
              getItemKey={(school) => school.id}
              getItemLink={(school) => `/schools/${school.slug}`}
              getItemLabel={(school) => school.name}
              getItemSublabel={(school) => school.college.name}
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 max-w-3xl mx-auto">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide text-center">
          Top Rated Professors
        </h2>

        {loggedIn === false && (
          <div className="mt-4">
            <LoginPrompt message="Log in to see the top rated professors." />
          </div>
        )}

        {loggedIn && error && <p className="mt-4 text-slate-500 text-center">{error}</p>}

        {loggedIn && !error && topProfessors.length === 0 && (
          <p className="mt-4 text-slate-500 text-center">No rated professors yet.</p>
        )}

        {loggedIn && topProfessors.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topProfessors.map((professor) => (
              <Link
                key={professor.id}
                to={`/professors/${professor.slug}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center">
                  {initials(professor.name)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">{professor.name}</p>
                  <p className="text-sm text-slate-400">{professor.department}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-blue-900">
                    {professor.overall_average_rating}
                    <span className="text-sm font-normal text-slate-400">/5</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {professor.overall_review_count}{' '}
                    {professor.overall_review_count === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
