import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProfessorDetail } from '../api/professors'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ProfessorDetail() {
  const { slug } = useParams()
  const [professor, setProfessor] = useState(null)
  const [error, setError] = useState(null)
  const [activeDepartment, setActiveDepartment] = useState('all')

  useEffect(() => {
    setProfessor(null)
    setError(null)
    setActiveDepartment('all')
    getProfessorDetail(slug)
      .then(setProfessor)
      .catch(() => setError('Failed to load this professor.'))
  }, [slug])

  const departmentTabs = useMemo(() => {
    if (!professor) return []
    return [...new Set(professor.courses_taught.map((c) => c.course.department))].sort()
  }, [professor])

  const visibleCourses = useMemo(() => {
    if (!professor) return []
    if (activeDepartment === 'all') return professor.courses_taught
    return professor.courses_taught.filter((c) => c.course.department === activeDepartment)
  }, [professor, activeDepartment])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}
        {!error && !professor && <p className="text-slate-500">Loading...</p>}

        {professor && (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-blue-900 text-white font-serif font-bold flex items-center justify-center text-lg">
                    {initials(professor.name)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-blue-900">{professor.name}</h1>
                    <p className="mt-1 text-slate-500">{professor.department}</p>
                  </div>
                </div>
                {professor.overall_average_rating !== null && (
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold text-blue-900">
                      {professor.overall_average_rating}
                      <span className="text-base font-normal text-slate-400">/5</span>
                    </p>
                    <p className="text-xs text-slate-400">overall rating</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                {professor.overall_would_take_again_percent !== null && (
                  <span>
                    <span className="font-semibold text-blue-900">
                      {professor.overall_would_take_again_percent}%
                    </span>{' '}
                    would take again
                  </span>
                )}
                <span>
                  {professor.overall_review_count}{' '}
                  {professor.overall_review_count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Courses Taught
            </h2>

            {professor.courses_taught.length === 0 ? (
              <p className="mt-2 text-slate-500">No courses listed for this professor yet.</p>
            ) : (
              <>
                <div className="mt-3 flex gap-2 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveDepartment('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeDepartment === 'all'
                        ? 'border-blue-900 text-blue-900'
                        : 'border-transparent text-slate-500 hover:text-blue-900'
                    }`}
                  >
                    All ({professor.courses_taught.length})
                  </button>
                  {departmentTabs.map((department) => (
                    <button
                      key={department}
                      type="button"
                      onClick={() => setActiveDepartment(department)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                        activeDepartment === department
                          ? 'border-blue-900 text-blue-900'
                          : 'border-transparent text-slate-500 hover:text-blue-900'
                      }`}
                    >
                      {department} (
                      {professor.courses_taught.filter((c) => c.course.department === department).length})
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {visibleCourses.map((courseTaught) => (
                    <Link
                      key={courseTaught.id}
                      to={`/courses/${courseTaught.course.code}`}
                      className="block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:border-blue-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-blue-900">{courseTaught.course.code}</p>
                          <p className="text-slate-700">{courseTaught.course.name}</p>
                        </div>
                        {courseTaught.average_rating !== null && (
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-blue-900">
                              {courseTaught.average_rating}
                              <span className="text-sm font-normal text-slate-400">/5</span>
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                        {courseTaught.would_take_again_percent !== null && (
                          <span>
                            <span className="font-semibold text-blue-900">
                              {courseTaught.would_take_again_percent}%
                            </span>{' '}
                            would take again
                          </span>
                        )}
                        <span>
                          {courseTaught.review_count}{' '}
                          {courseTaught.review_count === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default ProfessorDetail
